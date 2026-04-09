import { useState, useEffect } from "react";

const MAX_HINT_LEVEL = 3;

function HintPanel({ hints, status }) {
  const [hintLevel, setHintLevel] = useState(1);

  // Reset hint level when new hints arrive (i.e. user ran code again)
  useEffect(() => {
    setHintLevel(1);
  }, [hints]);

  if (!hints) {
    return (
      <div className="card">
        <h3>AI Hint</h3>
        <div className="hint-box">
          Beginner-friendly hints will appear here.
        </div>
      </div>
    );
  }

  const visibleHints = [];
  for (let i = 1; i <= hintLevel; i++) {
    const key = `hint_${i}`;
    if (hints[key]) {
      visibleHints.push({ level: i, text: hints[key] });
    }
  }

  const canEscalate = hintLevel < MAX_HINT_LEVEL && hints[`hint_${hintLevel + 1}`];

  return (
    <div className="card">
      <div className="hint-header">
        <h3>AI Hint</h3>
        <span className="hint-level-badge">Level {hintLevel} / {MAX_HINT_LEVEL}</span>
      </div>

      {hints.problem_summary && (
        <div className="hint-section hint-summary">
          <strong>Problem:</strong> {hints.problem_summary}
        </div>
      )}

      {hints.why && (
        <div className="hint-section hint-why">
          <strong>Why it happens:</strong> {hints.why}
        </div>
      )}

      <div className="hint-box">
        {visibleHints.map(({ level, text }) => (
          <div key={level} className={`hint-item hint-level-${level}`}>
            <span className="hint-label">Hint {level}:</span> {text}
          </div>
        ))}
      </div>

      {hints.learning_tip && hintLevel === MAX_HINT_LEVEL && (
        <div className="hint-section hint-tip">
          <strong>Learning tip:</strong> {hints.learning_tip}
        </div>
      )}

      {canEscalate && (
        <button
          className="toolbar-btn hint-next-btn"
          onClick={() => setHintLevel((prev) => Math.min(prev + 1, MAX_HINT_LEVEL))}
        >
          Need more help? Show Hint {hintLevel + 1}
        </button>
      )}
    </div>
  );
}

export default HintPanel;
