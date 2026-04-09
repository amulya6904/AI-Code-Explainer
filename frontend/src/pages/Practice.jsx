import { useState } from "react";
import CodeEditor from "../components/editor/CodeEditor";
import EditorToolbar from "../components/editor/EditorToolbar";
import OutputPanel from "../components/panels/OutputPanel";
import HintPanel from "../components/panels/HintPanel";
import ProblemGuidance from "../components/ProblemGuidance";
import { problems } from "../data/problems";
import { starterCode } from "../data/starterCode";
import { submitCode } from "../api/client";

function Practice({ attempts, setAttempts }) {
  const [code, setCode] = useState(starterCode);
  const [status, setStatus] = useState("Idle");
  const [output, setOutput] = useState("");
  const [hints, setHints] = useState(null);
  const [errorLine, setErrorLine] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showHintModal, setShowHintModal] = useState(false);

  const handleRun = async () => {
    try {
      setStatus("Running...");
      setOutput("");
      setHints(null);
      setErrorLine(null);
      setErrorMessage("");

      const res = await submitCode({
        user_id: "demo_user",
        code: code,
      });

      console.log("Backend response:", res);

      const payload = res?.data ?? res ?? {};
      const exec =
        payload?.execution ??
        payload?.execution_result ??
        payload ??
        {};

      const finalStatus =
        exec?.status ||
        payload?.status ||
        (res?.success ? "Success" : "Error");

      const execOutput = exec?.output ?? payload?.output ?? null;
      const execError = exec?.error_message ?? payload?.error_message ?? exec?.stderr ?? payload?.stderr ?? null;

      let finalOutput;
      if (execOutput && execError) {
        finalOutput = execOutput + "\n\n" + execError;
      } else {
        finalOutput = execOutput || execError || "No output returned.";
      }

      const finalHints = payload?.hints ?? null;
      const finalErrorLine = exec?.line_number ?? null;
      const finalErrorMessage = exec?.error_message ?? "";

      setStatus(finalStatus);
      setOutput(finalOutput);
      setHints(finalHints);
      setErrorLine(finalErrorLine);
      setErrorMessage(finalErrorMessage);

      const newAttempt = {
        id: Date.now(),
        code: code,
        status: finalStatus,
        output: finalOutput,
        hints: finalHints,
        timestamp: new Date().toLocaleString(),
      };

      setAttempts((prev) => [newAttempt, ...prev]);
    } catch (err) {
      console.error(err);
      setStatus("Backend connection failed");
      setOutput("Check if backend is running on port 5000");
      setHints(null);
      setErrorLine(null);
      setErrorMessage("");
    }
  };

  const handleReset = () => {
    setCode(starterCode);
    setStatus("Idle");
    setOutput("");
    setHints(null);
    setErrorLine(null);
    setErrorMessage("");
  };

  return (
    <section className="workspace-page">
      <div className="workspace-layout">
        <div className="workspace-left card">
          <ProblemGuidance problem={problems[0]} />
        </div>

        <div className="workspace-right">
          <div className="card practice-editor">
            <EditorToolbar
              onRun={handleRun}
              onReset={handleReset}
              isRunning={status === "Running..."}
              onHint={() => setShowHintModal(true)}
              hasHints={!!hints}
            />
            <CodeEditor code={code} setCode={setCode} errorLine={errorLine} errorMessage={errorMessage} readOnly={status === "Running..."} />
          </div>

          <div className="workspace-feedback">
            <OutputPanel output={output} status={status} errorLine={errorLine} />
          </div>

          {showHintModal && (
            <HintPanel hints={hints} status={status} onClose={() => setShowHintModal(false)} />
          )}
        </div>
      </div>
    </section>
  );
}

export default Practice;
