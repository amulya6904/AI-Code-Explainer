import { useEffect, useState } from "react";
import CodeEditor from "../components/editor/CodeEditor";
import EditorToolbar from "../components/editor/EditorToolbar";
import OutputPanel from "../components/panels/OutputPanel";
import HintPanel from "../components/panels/HintPanel";
import ProblemGuidance from "../components/ProblemGuidance";
import { getProblemById } from "../data/problems";
import { submitCode } from "../api/client";

// ─── Output normalization ──────────────────────────────────────
// Java's println always terminates each line with a newline, and
// students sometimes print trailing spaces. We compare line-by-line
// against the expected output after stripping those cosmetic
// differences so the verdict only reacts to real content mismatches.
function normalizeOutput(raw) {
  if (!raw) return "";
  return raw
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+$/, ""))
    .join("\n")
    .replace(/\n+$/, "");
}

function outputsMatch(actual, expected) {
  return normalizeOutput(actual) === normalizeOutput(expected);
}

// Unwrap whatever shape /submit-code returned into a consistent
// {status, output, errorMessage, errorLine, hints} record.
function unpackResponse(res) {
  const payload = res?.data ?? res ?? {};
  const exec =
    payload?.execution ??
    payload?.execution_result ??
    payload ??
    {};

  const status =
    exec?.status ||
    payload?.status ||
    (res?.success ? "Success" : "Error");

  const execOutput = exec?.output ?? payload?.output ?? "";
  const execError =
    exec?.error_message ??
    payload?.error_message ??
    exec?.stderr ??
    payload?.stderr ??
    "";

  let combinedOutput;
  if (execOutput && execError) {
    combinedOutput = execOutput + "\n\n" + execError;
  } else {
    combinedOutput = execOutput || execError || "No output returned.";
  }

  return {
    status,
    rawOutput: execOutput || "",
    combinedOutput,
    errorMessage: execError,
    errorLine: exec?.line_number ?? null,
    hints: payload?.hints ?? null,
  };
}

function Practice({ attempts, setAttempts, selectedProblemId }) {
  const problem = getProblemById(selectedProblemId);

  const [code, setCode] = useState(problem.starterCode);
  const [status, setStatus] = useState("Idle");
  const [output, setOutput] = useState("");
  const [hints, setHints] = useState(null);
  const [errorLine, setErrorLine] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showHintModal, setShowHintModal] = useState(false);

  // Highest hint level the user has actually revealed this session.
  // Resets when the user picks a new problem or hits Reset. Carried
  // through to /submit-code so the hint-weighted success_rate on the
  // Progress page properly discounts heavily-hinted wins.
  const [hintsUsed, setHintsUsed] = useState(0);

  // Busy flags — separate so the button spinners don't fight.
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verdict from the last Submit click. Null means "no submit yet".
  // shape: { kind: 'accepted' | 'wrong_output' | 'error', message: string }
  const [verdict, setVerdict] = useState(null);

  // When the user picks a different problem on the Dashboard, reset
  // every piece of per-attempt state.
  useEffect(() => {
    setCode(problem.starterCode);
    setStatus("Idle");
    setOutput("");
    setHints(null);
    setErrorLine(null);
    setErrorMessage("");
    setShowHintModal(false);
    setHintsUsed(0);
    setVerdict(null);
  }, [problem.id]);

  const resetFeedback = () => {
    setOutput("");
    setHints(null);
    setErrorLine(null);
    setErrorMessage("");
    setVerdict(null);
  };

  // ─── Run: lightweight execution, no mastery signal ────────────
  const handleRun = async () => {
    try {
      setIsRunning(true);
      setStatus("Running...");
      resetFeedback();

      const res = await submitCode({
        user_id: "demo_user",
        code,
        submission_type: "run",
        problem_id: problem.id,
        problem_title: problem.title,
        problem_topic: problem.topic,
        hints_used: hintsUsed,
      });

      const unpacked = unpackResponse(res);
      setStatus(unpacked.status);
      setOutput(unpacked.combinedOutput);
      setHints(unpacked.hints);
      setErrorLine(unpacked.errorLine);
      setErrorMessage(unpacked.errorMessage);

      setAttempts((prev) => [
        {
          id: Date.now(),
          code,
          status: unpacked.status,
          output: unpacked.combinedOutput,
          hints: unpacked.hints,
          timestamp: new Date().toLocaleString(),
        },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
      setStatus("Backend connection failed");
      setOutput("Check if backend is running on port 5000");
      setHints(null);
      setErrorLine(null);
      setErrorMessage("");
    } finally {
      setIsRunning(false);
    }
  };

  // ─── Submit: real attempt, scored against expectedOutput ──────
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setStatus("Submitting...");
      resetFeedback();

      // Send expectedOutput so the backend can downgrade a
      // cleanly-running-but-wrong-output submission to resolved=False.
      // Without this, the backend's `status == "Success"` check would
      // mark any program that didn't crash as solved, inflating the
      // Solved tile on Progress.
      const res = await submitCode({
        user_id: "demo_user",
        code,
        submission_type: "submit",
        problem_id: problem.id,
        problem_title: problem.title,
        problem_topic: problem.topic,
        hints_used: hintsUsed,
        expected_output: problem.expectedOutput,
      });

      const unpacked = unpackResponse(res);
      setStatus(unpacked.status);
      setOutput(unpacked.combinedOutput);
      setHints(unpacked.hints);
      setErrorLine(unpacked.errorLine);
      setErrorMessage(unpacked.errorMessage);

      // Verdict: compilation / runtime failure → error
      //          compiles but output differs    → wrong_output
      //          compiles and output matches    → accepted
      let nextVerdict;
      if (unpacked.status !== "Success") {
        nextVerdict = {
          kind: "error",
          message:
            unpacked.status === "CompilationError"
              ? "Your code failed to compile. Fix the errors shown below."
              : "Your code crashed while running. See the error below.",
        };
      } else if (outputsMatch(unpacked.rawOutput, problem.expectedOutput)) {
        nextVerdict = {
          kind: "accepted",
          message:
            hintsUsed === 0
              ? "Accepted — solved without any hints. Outstanding."
              : `Accepted with ${hintsUsed} hint${hintsUsed > 1 ? "s" : ""} used.`,
        };
      } else {
        nextVerdict = {
          kind: "wrong_output",
          message:
            "Your program ran but the output doesn't match what's expected.",
        };
      }
      setVerdict(nextVerdict);

      setAttempts((prev) => [
        {
          id: Date.now(),
          code,
          status: nextVerdict.kind === "accepted" ? "Accepted" : unpacked.status,
          output: unpacked.combinedOutput,
          hints: unpacked.hints,
          timestamp: new Date().toLocaleString(),
        },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
      setStatus("Backend connection failed");
      setOutput("Check if backend is running on port 5000");
      setVerdict({
        kind: "error",
        message: "Couldn't reach the backend. Is the Flask server running?",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCode(problem.starterCode);
    setStatus("Idle");
    resetFeedback();
    setHintsUsed(0);
  };

  // HintPanel calls this whenever it reveals a new hint level so the
  // max-reached value is the one we eventually send to /submit-code.
  const handleHintLevelChange = (level) => {
    setHintsUsed((prev) => Math.max(prev, level));
  };

  const busy = isRunning || isSubmitting;

  return (
    <section className="workspace-page">
      <div className="workspace-layout">
        <div className="workspace-left card">
          <ProblemGuidance problem={problem} />
        </div>

        <div className="workspace-right">
          <div className="card practice-editor">
            <EditorToolbar
              onRun={handleRun}
              onSubmit={handleSubmit}
              onReset={handleReset}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              onHint={() => setShowHintModal(true)}
              hasHints={!!hints}
            />
            <CodeEditor
              code={code}
              setCode={setCode}
              errorLine={errorLine}
              errorMessage={errorMessage}
              readOnly={busy}
            />
          </div>

          {verdict && (
            <div className={`verdict-banner verdict-banner--${verdict.kind}`}>
              <span className="verdict-banner__icon">
                {verdict.kind === "accepted"
                  ? "✓"
                  : verdict.kind === "wrong_output"
                    ? "≠"
                    : "✕"}
              </span>
              <div className="verdict-banner__body">
                <div className="verdict-banner__title">
                  {verdict.kind === "accepted"
                    ? "Accepted"
                    : verdict.kind === "wrong_output"
                      ? "Wrong output"
                      : "Submission failed"}
                </div>
                <div className="verdict-banner__text">{verdict.message}</div>
              </div>
            </div>
          )}

          <div className="workspace-feedback">
            <OutputPanel
              output={output}
              status={status}
              errorLine={errorLine}
            />
          </div>

          {showHintModal && (
            <HintPanel
              hints={hints}
              status={status}
              onClose={() => setShowHintModal(false)}
              onHintLevelChange={handleHintLevelChange}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default Practice;
