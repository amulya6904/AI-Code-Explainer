import { useState } from "react";
import CalendarCard from "../components/CalendarCard";
import { problemsByTopic, TOPIC_ORDER, problems } from "../data/problems";

function Dashboard({ setActivePage, setSelectedProblemId, attempts }) {
  const [loggedInDates] = useState([
    "2026-04-07",
    "2026-04-08",
    "2026-04-15",
  ]);

  const grouped = problemsByTopic();

  // Daily challenge = the first problem in the catalog (a friendly starter).
  const dailyChallenge = problems[0];

  const openProblem = (problemId) => {
    setSelectedProblemId(problemId);
    setActivePage("Practice");
  };

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
            <h3>{dailyChallenge.title}</h3>
            <p className="challenge-desc">{dailyChallenge.description}</p>
            <button
              className="primary-btn"
              onClick={() => openProblem(dailyChallenge.id)}
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

        {TOPIC_ORDER.map((topic) => (
          <div key={topic} className="topic-group">
            <h3 className="topic-group-title">{topic}</h3>
            <div className="question-list">
              {grouped[topic].map((problem) => (
                <button
                  key={problem.id}
                  className="question-item question-button"
                  onClick={() => openProblem(problem.id)}
                >
                  <span className="question-id">{problem.id}.</span>
                  <span className="question-title">{problem.title}</span>
                  <span
                    className={`question-difficulty ${problem.difficulty.toLowerCase()}`}
                  >
                    {problem.difficulty}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Dashboard;
