function OutputPanel({ output, status, errorLine }) {
  const isError =
    status === "CompilationError" ||
    status === "RuntimeError" ||
    status === "Timeout";
  const isRunning = status === "Running...";

  return (
    <div className="card">
      <h3>Output / Errors</h3>
      {isError && errorLine && (
        <div className="error-line-badge">
          Error at line {errorLine}
        </div>
      )}
      <div className={`output-box${isError ? " output-error" : ""}`}>
        {isRunning ? (
          <div className="output-loading">
            <span className="spinner" />
            <span>Compiling and running...</span>
          </div>
        ) : (
          <pre>{output || "Your output and errors will appear here."}</pre>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;
