import React from "react";

function ProblemGuidance({ problem }) {
  if (!problem) {
    return (
      <div className="problem-guidance">
        <h2>Problem / Guidance</h2>
        <p>No problem selected.</p>
      </div>
    );
  }

  return (
    <div className="problem-guidance">
      <h2>Problem / Guidance</h2>

      <div className="problem-header">
        <h3>
          {problem.id}. {problem.title}
        </h3>
        <p>
          <strong>{problem.status}</strong> | <strong>{problem.difficulty}</strong>
        </p>
        <p>
          <strong>Topics:</strong> {problem.topics.join(", ")}
        </p>
      </div>

      <div className="problem-section-block">
        <p>{problem.description}</p>
        <p>{problem.note1}</p>
        <p>{problem.note2}</p>
      </div>

      <div className="problem-section-block">
        <h4>Examples</h4>
        {problem.examples.map((example, index) => (
          <div key={index} className="example-card">
            <p>
              <strong>{example.label}:</strong>
            </p>
            <p>
              <strong>Input:</strong> {example.input}
            </p>
            <p>
              <strong>Output:</strong> {example.output}
            </p>
            {example.explanation && (
              <p>
                <strong>Explanation:</strong> {example.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="problem-section-block">
        <h4>Constraints</h4>
        <ul>
          {problem.constraints.map((constraint, index) => (
            <li key={index}>{constraint}</li>
          ))}
        </ul>
      </div>

      <div className="problem-section-block">
        <h4>Beginner Tips</h4>
        <ul>
          {problem.beginnerTips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="problem-section-block">
        <h4>Follow-up</h4>
        <p>{problem.followUp}</p>
      </div>
    </div>
  );
}

export default ProblemGuidance;
