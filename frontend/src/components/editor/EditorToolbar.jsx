function EditorToolbar({ onRun, onReset, isRunning, onHint, hasHints }) {
  return (
    <div className="editor-toolbar">
      <div className="editor-toolbar-left">
        <select className="editor-select" defaultValue="Java" disabled={isRunning}>
          <option value="Java">Java</option>
        </select>

        <span className="editor-mode">Auto</span>
      </div>

      <div className="editor-toolbar-right">
        {hasHints && (
          <button className="toolbar-btn toolbar-hint" onClick={onHint} disabled={isRunning}>
            Hint
          </button>
        )}

        <button className="toolbar-btn toolbar-reset" onClick={onReset} disabled={isRunning}>
          Reset
        </button>

        <button className="toolbar-btn toolbar-run" onClick={onRun} disabled={isRunning}>
          {isRunning ? (
            <span className="run-btn-loading">
              <span className="spinner" />
              Running...
            </span>
          ) : (
            "Run"
          )}
        </button>
      </div>
    </div>
  );
}

export default EditorToolbar;
