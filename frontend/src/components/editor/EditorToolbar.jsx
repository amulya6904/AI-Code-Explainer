function EditorToolbar({ onRun, onReset }) {
  return (
    <div className="editor-toolbar">
      <div className="editor-toolbar-left">
        <select className="editor-select" defaultValue="Java">
          <option value="Java">Java</option>
        </select>

        <span className="editor-mode">Auto</span>
      </div>

      <div className="editor-toolbar-right">
        <button className="toolbar-btn toolbar-reset" onClick={onReset}>
          Reset
        </button>

        <button className="toolbar-btn toolbar-run" onClick={onRun}>
          Run
        </button>
      </div>
    </div>
  );
}

export default EditorToolbar;
