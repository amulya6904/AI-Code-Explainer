"""
routes.py
---------
Flask Blueprint containing all API routes for the AI-Based Java Tutor.

Routes
~~~~~~
GET  /api/health                     – Liveness probe.
POST /api/submit-code                – Accept Java code, execute it, generate hints, log to DB.
POST /api/request-hint               – Advance hint level for a (user, code, error) and return a hint.
GET  /api/learning-summary/<user>    – Return weak / improving / strong topics for a user.
POST /api/feedback                   – Record user feedback on a specific submission's hint quality.

Response envelope (all routes)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Every response – success or failure – uses the shape defined in ``response.py``::

    {"success": bool, "data": {} | null, "error": {} | null}

Design notes
~~~~~~~~~~~~
* Handlers are thin: validate → execute → hint → log → respond.
* No pymongo, no subprocess, no OpenAI imports here.
* Persistence goes through ``submission_service`` + ``database`` (never direct pymongo).
* Hint escalation state is owned by ``hint_manager`` (MongoDB-backed).
* Topic detection, learning analytics, and encouragement are delegated to
  ``submission_service``, ``topic_analyzer``, and ``encouragement_engine``.
"""

import json
import logging
from http import HTTPStatus
from typing import Optional

from flask import Blueprint, request

from database import log_llm_feedback
from encouragement_engine import generate_encouragement
from fallback_engine import process_with_fallback
from hallucination_guard import validate_and_filter_response
from hint_manager import (
    get_current_hint_level,
    reset_hint_level,
    update_hint_level,
)
from java_engine import execute_java_code
from llm import generate_hints
from response import ErrorCode, fail, ok
from submission_service import detect_topic_from_error, save_submission
from topic_analyzer import get_learning_summary

logger = logging.getLogger(__name__)

# Blueprint – all routes are mounted under /api (configured in app.py).
api_bp = Blueprint("api", __name__)


# ---------------------------------------------------------------------------
# Private helpers
# ---------------------------------------------------------------------------

def _validate_submit_body(body: Optional[dict]) -> Optional[tuple]:
    """
    Validate the request body for ``/submit-code`` and ``/request-hint``.

    Returns a ``(response, status_code)`` error tuple when validation fails,
    or ``None`` when the body is valid.  The caller returns early on non-None.
    """
    if not body:
        return fail(
            message="Request body must be valid JSON.",
            code=ErrorCode.INVALID_INPUT,
            http_status=HTTPStatus.BAD_REQUEST,
        )

    if not (body.get("user_id") or "").strip():
        return fail(
            message="Field 'user_id' is required and must not be empty.",
            code=ErrorCode.MISSING_FIELD,
            details={"field": "user_id"},
            http_status=HTTPStatus.BAD_REQUEST,
        )

    if not (body.get("code") or "").strip():
        return fail(
            message="Field 'code' is required and must not be empty.",
            code=ErrorCode.MISSING_FIELD,
            details={"field": "code"},
            http_status=HTTPStatus.BAD_REQUEST,
        )

    return None  # all good


def _http_status_for(execution_status: str) -> int:
    """Map an engine status string to an HTTP status code."""
    return HTTPStatus.REQUEST_TIMEOUT if execution_status == "Timeout" else HTTPStatus.OK


def _safe_call(label: str, fn, *args, default=None, **kwargs):
    """
    Run a non-critical auxiliary call and swallow any exception.

    Used for MongoDB-dependent helpers whose failure must never break the
    primary request flow (persistence / analytics are best-effort).
    """
    try:
        return fn(*args, **kwargs)
    except Exception as exc:  # noqa: BLE001
        logger.error("%s failed: %s", label, exc)
        return default


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@api_bp.route("/health", methods=["GET"])
def health():
    """
    GET /api/health
    ---------------
    Liveness probe.  Returns ``{"status": "Backend Running"}`` on success.
    """
    return ok({"status": "Backend Running"})


@api_bp.route("/submit-code", methods=["POST"])
def submit_code():
    """
    POST /api/submit-code
    ---------------------
    Accept a Java snippet, compile + execute it, generate hints on error,
    persist a rich submission record, and return the full diagnostic payload.

    Request body
    ~~~~~~~~~~~~
    .. code-block:: json

        {"user_id": "alice", "code": "public class Main { ... }"}

    Success response (error case)
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    .. code-block:: json

        {
          "success": true,
          "data": {
            "user_id": "alice",
            "submission_id": "654...",
            "execution": { "status": "RuntimeError", "error_message": "...", ... },
            "hints": { "problem_summary": "...", "hint_1": "...", ... },
            "detected_topic": "arrays",
            "hint_level": 1,
            "encouragement": { "show_message": true, "message": "Keep going..." }
          },
          "error": null
        }
    """
    # ------------------------------------------------------------------
    # 1. Parse and validate
    # ------------------------------------------------------------------
    body = request.get_json(silent=True)

    validation_error = _validate_submit_body(body)
    if validation_error:
        return validation_error

    user_id: str = body["user_id"].strip()
    code:    str = body["code"].strip()

    # Optional submission metadata. "run" = editor run button,
    # "submit" = real submit attempt. Only submits feed topic_stats.
    raw_type = str(body.get("submission_type") or "submit").strip().lower()
    submission_type = raw_type if raw_type in ("run", "submit") else "submit"
    problem_id = body.get("problem_id")
    problem_title = body.get("problem_title")

    # The frontend HintPanel is the source of truth for how many hint
    # levels the student has actually revealed — it's echoed back here
    # so the hint-weighted success rate on the Progress page discounts
    # heavily-hinted wins. If the client doesn't send it we fall back
    # to the hint_manager escalation level below.
    client_hints_used = body.get("hints_used")
    try:
        client_hints_used = int(client_hints_used) if client_hints_used is not None else None
    except (TypeError, ValueError):
        client_hints_used = None

    # ------------------------------------------------------------------
    # 2. Execute Java code
    # ------------------------------------------------------------------
    try:
        result = execute_java_code(code)
    except Exception as exc:
        logger.exception("execute_java_code raised unexpectedly for user=%s", user_id)
        return fail(
            message="Internal error during code execution.",
            code=ErrorCode.EXECUTION_FAILED,
            details={"detail": str(exc)},
            http_status=HTTPStatus.INTERNAL_SERVER_ERROR,
        )

    status = result.get("status", "Unknown")
    resolved = status == "Success"
    error_message = result.get("error_message") or ""

    # ------------------------------------------------------------------
    # 3. Hint generation with fallback pipeline
    # ------------------------------------------------------------------
    hints: Optional[dict] = None
    hallucination_flag = False

    if not resolved:
        try:
            raw_hints = generate_hints(code=code, execution_result=result, hint_level=3)
            if raw_hints.get("status") == "LLMError":
                raw_hints = {}

            # Detect hallucination: did the raw LLM output pass validation?
            if raw_hints and validate_and_filter_response(raw_hints, result) is None:
                hallucination_flag = True

            hints = process_with_fallback(
                code=code,
                execution_result=result,
                hint_level=3,
                llm_output=raw_hints,
            )
        except Exception as exc:  # noqa: BLE001
            logger.error("hint generation raised unexpectedly: %s", exc)
            hallucination_flag = True
            hints = {
                "problem_summary": "There is an issue in your code.",
                "why": str(error_message or "Unknown error."),
                "hint_1": "Carefully read the error message and identify the problematic line.",
                "learning_tip": "Focus on understanding the concept behind the error.",
            }

    # ------------------------------------------------------------------
    # 4. Topic detection
    # ------------------------------------------------------------------
    detected_topic = detect_topic_from_error(error_message) if not resolved else "general"

    # ------------------------------------------------------------------
    # 5. Hint-manager state sync
    #    * On success: reset any prior escalation session.
    #    * On error: read current level (read-only — actual escalation
    #      happens in /api/request-hint).
    # ------------------------------------------------------------------
    if resolved:
        _safe_call("reset_hint_level", reset_hint_level, user_id, code)
        current_hint_level = 0
    else:
        current_hint_level = _safe_call(
            "get_current_hint_level",
            get_current_hint_level,
            user_id, code, status,
            default=1,
        )

    # ------------------------------------------------------------------
    # 6. Persist rich submission record + topic stats  (best-effort)
    #    Write rules:
    #      - submit         : always persist (success or failure)
    #      - run + success  : skip entirely (no telemetry value, avoids
    #                         spamming the event log on every run click)
    #      - run + failure  : persist (error telemetry for Progress page)
    # ------------------------------------------------------------------
    submission_id = None
    if submission_type == "submit" or not resolved:
        llm_response_text = json.dumps(hints) if hints else ""
        effective_hints_used = (
            client_hints_used if client_hints_used is not None else current_hint_level
        )
        submission_id = _safe_call(
            "save_submission",
            save_submission,
            user_id=user_id,
            code=code,
            topic=detected_topic,
            error_type=status,
            error_message=error_message,
            hints_used=effective_hints_used,
            resolved=resolved,
            llm_response=llm_response_text,
            hallucination_flag=hallucination_flag,
            confidence_score=None,
            user_feedback="not_given",
            submission_type=submission_type,
            problem_id=problem_id,
            problem_title=problem_title,
        )

    # ------------------------------------------------------------------
    # 7. Encouragement message (after topic stats have been updated)
    # ------------------------------------------------------------------
    encouragement = _safe_call(
        "generate_encouragement",
        generate_encouragement,
        user_id, detected_topic,
        default={"show_message": False, "message": ""},
    )

    # ------------------------------------------------------------------
    # 8. Build and return response
    # ------------------------------------------------------------------
    data = {
        "user_id":        user_id,
        "submission_id":  submission_id,
        "execution":      result,
        "hints":          hints,
        "detected_topic": detected_topic,
        "hint_level":     current_hint_level,
        "encouragement":  encouragement,
    }

    return ok(data, http_status=_http_status_for(status))


@api_bp.route("/request-hint", methods=["POST"])
def request_hint():
    """
    POST /api/request-hint
    ----------------------
    Explicitly advance the hint escalation level for a (user, code, error)
    combination and return the hint at the new level.

    Request body
    ~~~~~~~~~~~~
    .. code-block:: json

        {
          "user_id": "alice",
          "code":    "public class Main { ... }",
          "error_type":    "RuntimeError",
          "error_message": "java.lang.NullPointerException: ..."
        }

    Response
    ~~~~~~~~
    .. code-block:: json

        {
          "success": true,
          "data": {
            "hint_level": 2,
            "max_level":  3,
            "hint":       { "problem_summary": "...", "hint_1": "...", "hint_2": "..." }
          },
          "error": null
        }
    """
    body = request.get_json(silent=True)

    validation_error = _validate_submit_body(body)
    if validation_error:
        return validation_error

    user_id:       str = body["user_id"].strip()
    code:          str = body["code"].strip()
    error_type:    str = (body.get("error_type") or "").strip() or "RuntimeError"
    error_message: str = (body.get("error_message") or "").strip()

    # Advance the escalation level (capped at MAX_HINT_LEVEL internally).
    new_level = _safe_call(
        "update_hint_level",
        update_hint_level,
        user_id, code, error_type,
        default=1,
    )

    # Build a synthetic execution_result dict so the hint pipeline has
    # consistent context without re-running the Java engine.
    execution_result = {
        "status":        error_type,
        "error_message": error_message,
        "output":        "",
    }

    try:
        raw_hints = generate_hints(
            code=code,
            execution_result=execution_result,
            hint_level=new_level,
        )
        if raw_hints.get("status") == "LLMError":
            raw_hints = {}

        hint_payload = process_with_fallback(
            code=code,
            execution_result=execution_result,
            hint_level=new_level,
            llm_output=raw_hints,
        )
    except Exception as exc:  # noqa: BLE001
        logger.error("request-hint: hint generation failed: %s", exc)
        hint_payload = {
            "problem_summary": "There is an issue in your code.",
            "why": error_message or "Unknown error.",
            "hint_1": "Carefully read the error message and identify the problematic line.",
            "learning_tip": "Focus on understanding the concept behind the error.",
        }

    return ok({
        "hint_level": new_level,
        "max_level":  3,
        "hint":       hint_payload,
    })


@api_bp.route("/learning-summary/<string:user_id>", methods=["GET"])
def learning_summary(user_id: str):
    """
    GET /api/learning-summary/<user_id>
    -----------------------------------
    Return a structured summary of the user's learning state:
    weak / improving / strong topics + total submission count.

    Response
    ~~~~~~~~
    .. code-block:: json

        {
          "success": true,
          "data": {
            "weak_topics":       ["loops"],
            "improving_topics":  ["arrays"],
            "strong_topics":     ["variables"],
            "total_submissions": 24
          },
          "error": null
        }
    """
    user_id = (user_id or "").strip()
    if not user_id:
        return fail(
            message="Path parameter 'user_id' must not be empty.",
            code=ErrorCode.MISSING_FIELD,
            details={"field": "user_id"},
            http_status=HTTPStatus.BAD_REQUEST,
        )

    try:
        summary = get_learning_summary(user_id)
    except Exception as exc:  # noqa: BLE001
        logger.error("get_learning_summary failed for user=%s: %s", user_id, exc)
        return fail(
            message="Failed to load learning summary.",
            code=ErrorCode.INTERNAL_ERROR,
            details={"detail": str(exc)},
            http_status=HTTPStatus.INTERNAL_SERVER_ERROR,
        )

    return ok(summary)


@api_bp.route("/feedback", methods=["POST"])
def feedback():
    """
    POST /api/feedback
    ------------------
    Record a user's feedback about the helpfulness of a previous submission's
    LLM hint.  Used downstream for hallucination analytics.

    Request body
    ~~~~~~~~~~~~
    .. code-block:: json

        {
          "submission_id":      "654abc...",
          "hallucination_flag": false,
          "user_feedback":      "correct"
        }

    ``user_feedback`` must be one of ``correct`` / ``incorrect`` / ``not_given``.
    """
    body = request.get_json(silent=True) or {}

    submission_id = (body.get("submission_id") or "").strip()
    if not submission_id:
        return fail(
            message="Field 'submission_id' is required.",
            code=ErrorCode.MISSING_FIELD,
            details={"field": "submission_id"},
            http_status=HTTPStatus.BAD_REQUEST,
        )

    hallucination_flag = bool(body.get("hallucination_flag", False))
    user_feedback = str(body.get("user_feedback") or "not_given")

    try:
        updated = log_llm_feedback(submission_id, hallucination_flag, user_feedback)
    except Exception as exc:  # noqa: BLE001
        logger.error("log_llm_feedback failed for submission=%s: %s", submission_id, exc)
        return fail(
            message="Failed to record feedback.",
            code=ErrorCode.INTERNAL_ERROR,
            details={"detail": str(exc)},
            http_status=HTTPStatus.INTERNAL_SERVER_ERROR,
        )

    if not updated:
        return fail(
            message="No submission found with that id.",
            code=ErrorCode.NOT_FOUND,
            details={"submission_id": submission_id},
            http_status=HTTPStatus.NOT_FOUND,
        )

    return ok({"updated": True, "submission_id": submission_id})
