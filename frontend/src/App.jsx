import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Practice from "./pages/Practice";
import Progress from "./pages/Progress";
import { problems } from "./data/problems";
import "./styles/theme.css";
import "./styles/globals.css";
import "./styles/layout.css";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [attempts, setAttempts] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState(problems[0].id);

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="main-content">

        {activePage === "Dashboard" && (
          <Dashboard
            setActivePage={setActivePage}
            setSelectedProblemId={setSelectedProblemId}
          />
        )}
        {activePage === "Practice" && (
          <Practice
            attempts={attempts}
            setAttempts={setAttempts}
            selectedProblemId={selectedProblemId}
          />
        )}
        {activePage === "Progress" && (
          <Progress
            setActivePage={setActivePage}
            setSelectedProblemId={setSelectedProblemId}
          />
        )}
      </main>
    </div>
  );
}

export default App;
