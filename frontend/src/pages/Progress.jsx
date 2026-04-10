import { useEffect, useMemo, useState } from "react";
import { fetchLearningSummary, deriveInsight } from "../api/mockData";

// ─── Helpers ─────────────────────────────────────────────────
const STATUS_CLS = {
  strong: "mastery-status--strong",
  improving: "mastery-status--improving",
  weak: "mastery-status--weak",
};

function classifyTopic(topicName, summary) {
  if (summary.strong_topics.includes(topicName)) return "strong";
  if (summary.improving_topics.includes(topicName)) return "improving";
  return "weak";
}

function pct(value) {
  return `${Math.round(value * 100)}%`;
}

function progressFillClass(accuracy) {
  if (accuracy >= 0.75) return "progress__fill--success";
  if (accuracy >= 0.5) return "progress__fill--warning";
  return "progress__fill--danger";
}

function formatRelativeTime(isoString) {
  if (!isoString) return "";
  const then = new Date(isoString);
  const now = Date.now();
  const diff = now - then.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return then.toLocaleDateString();
}

// ─── Component ───────────────────────────────────────────────
function Progress({ setActivePage, setSelectedProblemId }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchLearningSummary("demo_user").then((data) => {
      if (!cancelled) {
        setSummary(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const insight = useMemo(() => deriveInsight(summary), [summary]);

  const maxErrorCount = useMemo(() => {
    if (!summary) return 1;
    return Math.max(...summary.error_breakdown.map((e) => e.count), 1);
  }, [summary]);

  const openProblem = (problemId) => {
    if (setSelectedProblemId && setActivePage) {
      setSelectedProblemId(problemId);
      setActivePage("Practice");
    }
  };

  if (loading || !summary) {
    return (
      <section className="page">
        <div className="page-header">
          <h2>Progress</h2>
          <p>Loading your learning analytics…</p>
        </div>
      </section>
    );
  }

  const {
    total_submissions,
    successful_submissions,
    success_rate,
    topic_performance,
    streak,
    recent_submissions,
    error_breakdown,
    recommendations,
  } = summary;

  return (
    <section className="page">
      <div className="page-header">
        <span className="eyebrow">Learning analytics</span>
        <h2>Your Progress</h2>
        <p>A living portrait of how you learn, where you excel, and what to tackle next.</p>
      </div>

      {/* ─── AI Insight banner ─────────────────────── */}
      <div className="insight-banner">
        <div className="insight-banner__icon">✦</div>
        <div className="insight-banner__text">
          <div className="insight-banner__label">Codexa Insight</div>
          <p className="insight-banner__body">{insight}</p>
        </div>
      </div>

      {/* ─── Stat grid ─────────────────────────────── */}
      <div className="progress-grid">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--cyan">⚡</div>
          <div className="stat-card__label">Total submissions</div>
          <div className="stat-card__value">{total_submissions}</div>
          <div className="stat-card__hint">Across all problems</div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--success">✓</div>
          <div className="stat-card__label">Solved</div>
          <div className="stat-card__value">
            {successful_submissions}
            <span className="unit">/ {total_submissions}</span>
          </div>
          <div className="stat-card__hint stat-card__trend-up">
            {pct(success_rate)} success rate
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--warning">🔥</div>
          <div className="stat-card__label">Current streak</div>
          <div className="stat-card__value">
            {streak.current}
            <span className="unit">days</span>
          </div>
          <div className="stat-card__hint">Best · {streak.longest} days</div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--purple">◈</div>
          <div className="stat-card__label">Topics mastered</div>
          <div className="stat-card__value">
            {summary.strong_topics.length}
            <span className="unit">/ {topic_performance.length}</span>
          </div>
          <div className="stat-card__hint">
            {summary.weak_topics.length} need work
          </div>
        </div>
      </div>

      {/* ─── Two-column layout ─────────────────────── */}
      <div className="progress-sections">
        {/* LEFT: mastery + errors */}
        <div className="progress-section-stack">
          <div className="card">
            <div className="progress-section-title">Topic Mastery</div>
            <div className="topic-mastery-list">
              {topic_performance.map((tp) => {
                const status = classifyTopic(tp.topic, summary);
                return (
                  <div key={tp.topic} className="topic-mastery-item">
                    <div className="topic-mastery-header">
                      <span className="topic-mastery-name">{tp.topic}</span>
                      <div className="topic-mastery-meta">
                        <span className="topic-mastery-value">
                          {pct(tp.accuracy)}
                        </span>
                        <span>
                          {tp.successes}/{tp.attempts}
                        </span>
                        <span className={`mastery-status ${STATUS_CLS[status]}`}>
                          {status}
                        </span>
                      </div>
                    </div>
                    <div className="progress">
                      <div
                        className={`progress__fill ${progressFillClass(tp.accuracy)}`}
                        style={{ width: `${Math.round(tp.accuracy * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <div className="progress-section-title">Error Breakdown</div>
            <div className="error-breakdown">
              {error_breakdown.map((err) => (
                <div key={err.type} className="error-type-row">
                  <div className="error-type-header">
                    <span className="error-type-name">{err.type}</span>
                    <span className="error-type-count">
                      {err.count} {err.count === 1 ? "time" : "times"}
                    </span>
                  </div>
                  <div className="progress">
                    <div
                      className="progress__fill progress__fill--danger"
                      style={{
                        width: `${Math.round(
                          (err.count / maxErrorCount) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: recommendations + activity */}
        <div className="progress-section-stack">
          <div className="card">
            <div className="progress-section-title">Recommended Next</div>
            <div className="recommendations-list">
              {recommendations.map((rec, idx) => (
                <button
                  key={rec.problem_id}
                  className="recommendation-item"
                  onClick={() => openProblem(rec.problem_id)}
                >
                  <span className="recommendation-number">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="recommendation-body">
                    <div className="recommendation-title">{rec.title}</div>
                    <div className="recommendation-reason">{rec.reason}</div>
                  </div>
                  <span
                    className={`badge badge--${rec.difficulty.toLowerCase()}`}
                  >
                    {rec.difficulty}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="progress-section-title">Recent Activity</div>
            {recent_submissions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">◇</div>
                <div className="empty-state__text">No activity yet.</div>
              </div>
            ) : (
              <div className="activity-feed">
                {recent_submissions.map((sub) => {
                  const success = sub.status === "Success";
                  return (
                    <div key={sub.id} className="activity-item">
                      <div
                        className={`activity-icon ${
                          success
                            ? "activity-icon--success"
                            : "activity-icon--error"
                        }`}
                      >
                        {success ? "✓" : "✕"}
                      </div>
                      <div className="activity-body">
                        <div className="activity-title">
                          {sub.problem_title}
                        </div>
                        <div className="activity-meta">
                          {sub.topic} · {formatRelativeTime(sub.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Progress;
