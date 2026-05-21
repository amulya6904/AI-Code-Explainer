import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import CodeEditor from "../components/editor/CodeEditor";
import VideoPlayer from "../components/VideoPlayer";
import API from "../api/client";

// Render API routed through Vite proxy to avoid CORS issues
const RENDER_API = axios.create({
  baseURL: "/render-api",
  timeout: 60000,
});

const DEFAULT_CODE = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`;

const QUALITY_OPTIONS = [
  { value: "low", label: "Low (480p)" },
  { value: "medium", label: "Medium (720p)" },
  { value: "high", label: "High (1080p)" },
  { value: "production", label: "Production (1440p)" },
];

// Extract the main class name from Java source code.
// Tries "public class Foo" first, then falls back to any top-level "class Foo".
function extractClassName(source) {
  const publicMatch = source.match(/public\s+class\s+(\w+)/);
  if (publicMatch) return publicMatch[1];
  // Match "class Foo" that isn't inside a string or comment (simple heuristic)
  const classMatch = source.match(/(?:^|\n)\s*(?:abstract\s+)?class\s+(\w+)/);
  return classMatch ? classMatch[1] : null;
}

// Rename the main class declaration in the source code.
// Handles both "public class Foo" and plain "class Foo" declarations.
function renamePublicClass(source, newName) {
  // Try public class first
  if (/public\s+class\s+\w+/.test(source)) {
    return source.replace(/(public\s+class\s+)\w+/, `$1${newName}`);
  }
  // Fall back to any top-level class declaration
  return source.replace(/((?:^|\n)\s*(?:abstract\s+)?class\s+)\w+/, `$1${newName}`);
}

function VideoGeneration() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [fileName, setFileName] = useState("Main.java");
  const [quality, setQuality] = useState("low");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [runSuccess, setRunSuccess] = useState(false);
  const [errorLine, setErrorLine] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Video generation state
  const [jobId, setJobId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoError, setVideoError] = useState(null);

  const pollIntervalRef = useRef(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const handleRun = async () => {
    try {
      setIsRunning(true);
      setOutput("");
      setErrorLine(null);
      setErrorMessage("");
      setRunSuccess(false);

      const response = await API.post("/submit-code", {
        user_id: "demo_user",
        // The backend always compiles as Main.java, so rename the public class to Main
        code: renamePublicClass(code, "Main"),
        submission_type: "run",
        problem_id: "video_gen_run",
        problem_title: "Video Generation",
        problem_topic: "general",
        hints_used: 0,
      });

      const payload = response?.data ?? {};
      const exec =
        payload?.data?.execution ??
        payload?.data?.execution_result ??
        payload?.data ??
        payload?.execution ??
        payload?.execution_result ??
        {};

      const status = exec?.status || payload?.data?.status || payload?.status || "Error";
      const execOutput = exec?.output ?? payload?.data?.output ?? "";
      const execError =
        exec?.error_message ?? payload?.data?.error_message ?? exec?.stderr ?? "";

      let combinedOutput;
      if (execOutput && execError) {
        combinedOutput = execOutput + "\n\n" + execError;
      } else {
        combinedOutput = execOutput || execError || "No output returned.";
      }

      setOutput(combinedOutput);

      if (status === "Success") {
        setRunSuccess(true);
        setErrorLine(null);
        setErrorMessage("");
      } else {
        setRunSuccess(false);
        setErrorLine(exec?.line_number ?? null);
        setErrorMessage(execError || combinedOutput);
      }
    } catch (err) {
      console.error(err);
      setOutput("Backend connection failed. Check if backend is running on port 5000.");
      setRunSuccess(false);
    } finally {
      setIsRunning(false);
    }
  };

  const pollJobStatus = useCallback(
    (id) => {
      pollIntervalRef.current = setInterval(async () => {
        try {
          const response = await RENDER_API.get(`/jobs/${id}`);
          const job = response?.data?.data ?? response?.data ?? {};

          const jobProgress = job.progress ?? 0;
          const jobStage = job.stage ?? "";
          const jobStatus = job.status ?? "";

          setProgress(jobProgress);
          setStage(jobStage);

          if (jobStatus === "completed" || jobStage === "completed") {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
            setIsGenerating(false);
            setProgress(100);

            setVideoUrl(`http://localhost:4000/api/jobs/${id}/video`);
          } else if (jobStatus === "failed") {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
            setIsGenerating(false);
            setVideoError(
              job.error?.message || job.error || "Video generation failed."
            );
          }
        } catch (err) {
          console.error("Polling error:", err);
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
          setIsGenerating(false);
          setVideoError("Lost connection while checking progress.");
        }
      }, 1500);
    },
    []
  );

  const handleGenerate = async () => {
    if (!runSuccess) return;

    try {
      setIsGenerating(true);
      setProgress(0);
      setStage("queued");
      setVideoUrl(null);
      setVideoError(null);

      // Create a file blob from the code
      const blob = new Blob([code], { type: "text/x-java" });
      const formData = new FormData();
      formData.append("file", blob, fileName);
      formData.append("quality", quality);

      const response = await RENDER_API.post("/render", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = response?.data?.data ?? response?.data ?? {};
      const id = data.job_id || data.id;

      if (!id) {
        throw new Error("No job ID returned from server.");
      }

      setJobId(id);
      pollJobStatus(id);
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
      const errMsg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to start video generation.";
      setVideoError(errMsg);
    }
  };

  const canGenerate = runSuccess && !isGenerating;

  return (
    <section className="workspace-page">
      <div className="page-header">
        <h1>
          Video <span className="gradient-text">Generation</span>
        </h1>
        <p>Write Java code and generate animated execution videos</p>
      </div>

      <div className="video-gen-layout">
        {/* Left column: Editor + Output */}
        <div className="video-gen-left">
          {/* File name tab + controls */}
          <div className="video-gen-toolbar card">
            <div className="video-gen-file-tab">
              <span className="video-gen-file-icon">📄</span>
              <input
                type="text"
                className="video-gen-filename-input"
                value={fileName}
                onChange={(e) => {
                  const newFileName = e.target.value;
                  setFileName(newFileName);
                  setRunSuccess(false);

                  // Sync the public class name with the filename
                  const baseName = newFileName.replace(/\.java$/i, "");
                  if (baseName && /^\w+$/.test(baseName)) {
                    const currentClass = extractClassName(code);
                    if (currentClass && currentClass !== baseName) {
                      setCode(renamePublicClass(code, baseName));
                    }
                  }
                }}
                spellCheck={false}
              />
            </div>

            <div className="video-gen-actions">
              <button
                className="btn btn--ghost btn--sm"
                onClick={handleRun}
                disabled={isRunning}
              >
                {isRunning ? (
                  <>
                    <span className="spinner" /> Running...
                  </>
                ) : (
                  <>▶ Run</>
                )}
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="card video-gen-editor">
            <CodeEditor
              code={code}
              setCode={(val) => {
                setCode(val);
                setRunSuccess(false);

                // Sync filename with the public class name in code
                const className = extractClassName(val);
                if (className) {
                  const expectedFile = `${className}.java`;
                  if (expectedFile !== fileName) {
                    setFileName(expectedFile);
                  }
                }
              }}
              errorLine={errorLine}
              errorMessage={errorMessage}
              readOnly={isRunning || isGenerating}
              editorHeight={380}
            />
          </div>

          {/* Output Panel */}
          <div className="card video-gen-output">
            <div className="video-gen-output-header">
              <span className="card-label">Output</span>
              {runSuccess && (
                <span className="video-gen-status video-gen-status--success">
                  ✓ Compiled &amp; ran successfully
                </span>
              )}
            </div>
            <pre className="video-gen-output-content">
              {output || "Run your code to see output here..."}
            </pre>
          </div>
        </div>

        {/* Right column: Video Player */}
        <div className="video-gen-right">
          {/* Quality + Generate controls */}
          <div className="card video-gen-controls">
            <div className="video-gen-quality-row">
              <label className="video-gen-quality-label">Quality</label>
              <select
                className="video-gen-quality-select"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                disabled={isGenerating}
              >
                {QUALITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn btn--primary video-gen-generate-btn"
              onClick={handleGenerate}
              disabled={!canGenerate}
              title={
                !runSuccess
                  ? "Run your code successfully before generating"
                  : isGenerating
                    ? "Generation in progress..."
                    : "Generate video"
              }
            >
              {isGenerating ? (
                <>
                  <span className="spinner" /> Generating...
                </>
              ) : (
                <>🎬 Generate Video</>
              )}
            </button>

            {!runSuccess && !isGenerating && (
              <p className="video-gen-hint">
                Run your code successfully before generating a video.
              </p>
            )}
          </div>

          {/* Video Player Area */}
          <div className="card video-gen-player-card">
            {videoUrl ? (
              <div className="video-gen-player-wrapper">
                <VideoPlayer src={videoUrl} />
              </div>
            ) : isGenerating ? (
              <div className="video-gen-progress-section">
                <div className="video-gen-progress-icon">🎞️</div>
                <h3>Generating your video...</h3>
                <p className="video-gen-stage">
                  Stage: <span>{stage || "queued"}</span>
                </p>
                <div className="progress video-gen-progress-bar">
                  <div
                    className="progress__fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="video-gen-progress-pct">{progress}%</span>
              </div>
            ) : videoError ? (
              <div className="video-gen-error-section">
                <div className="video-gen-error-icon">⚠️</div>
                <h3>Generation Failed</h3>
                <p className="video-gen-error-msg">{videoError}</p>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => {
                    setVideoError(null);
                    setProgress(0);
                  }}
                >
                  Dismiss
                </button>
              </div>
            ) : (
              <div className="video-gen-placeholder">
                <div className="video-gen-placeholder-icon">🎬</div>
                <h3>Video Preview</h3>
                <p>
                  Your generated animation will appear here. Write some Java
                  code, run it, then hit Generate.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default VideoGeneration;
