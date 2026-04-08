import { useState } from "react";
import CalendarCard from "../components/CalendarCard";

function Dashboard({ setActivePage, setSelectedQuestion, attempts }) {
  const [loggedInDates] = useState([
    "2026-04-07",
    "2026-04-08",
    "2026-04-15",
  ]);

  return (
    <section className="page">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Your coding journey at a glance.</p>
      </div>

      <div className="dashboard-top-section">
        <div className="dashboard-top-left">
          <div className="card daily-challenge-card">
            <p className="card-label">🔥 Daily Challenge</p>
            <h3>Two Sum</h3>
            <p className="challenge-desc">
              Find two indices such that their values add up to the target.
            </p>
            <button
              className="primary-btn"
              onClick={() => {
                setSelectedQuestion("Two Sum");
                setActivePage("Practice");
              }}
            >
              Solve Now
            </button>
          </div>

          <div className="card streak-card">
            <p className="card-label">📈 Coding Streak</p>
            <h3>---</h3>
            <p className="streak-subtext">Best Streak: 7 Days</p>
            <div className="motivation-box">
              <p>Keep the momentum going! Every day counts.</p>
            </div>
          </div>
        </div>

        <CalendarCard loggedInDates={loggedInDates} />
      </div>

      <div className="question-section">
        <h2>Problems</h2>

        <div className="question-list">
          <button
            className="question-item solved question-button"
            onClick={() => setActivePage("Practice")}
          >
            <span className="question-id">1.</span>
            <span className="question-title">Two Sum</span>
            <span className="question-difficulty easy">Easy</span>
          </button>
        </div>
      </div>

    </section>
  );
}

export default Dashboard;
