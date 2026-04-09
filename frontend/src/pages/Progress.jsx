function Progress({ attempts }) {
  const total = attempts.length;
  const successCount = attempts.filter((a) => a.status === "Success").length;

  const successRate =
    total > 0 ? ((successCount / total) * 100).toFixed(1) : 0;

  let insight = "";

  if (total === 0) {
    insight = "Start practicing to unlock personalized insights.";
  } else if (successRate >= 80) {
    insight = "You're performing exceptionally well. Keep pushing forward!";
  } else if (successRate >= 50) {
    insight = "You're making solid progress. Focus on consistency.";
  } else {
    insight = "Strengthen your fundamentals and keep practicing.";
  }

  const easy = 80;
  const medium = 60;
  const hard = 30;

  const topics = [
    { name: "Loops", value: 75, color: "#4f46e5" },
    { name: "Arrays", value: 55, color: "#10b981" },
    { name: "Conditions", value: 85, color: "#f59e0b" },
    { name: "OOP", value: 40, color: "#ef4444" },
  ];

  const card = {
    padding: "24px",
    borderRadius: "16px",
    background: "#ffffff",
    boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
  };

  const title = {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#374151",
  };

  const section = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  };

  return (
    <section className="page" style={{ padding: "30px", background: "#f1f5f9" }}>
      {/* HEADER */}
      <div style={{ marginBottom: "25px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b" }}>
          📊 Progress Dashboard
        </h2>
        <p style={{ color: "#64748b" }}>
          Track your learning and improve consistently.
        </p>
      </div>

      {/* AI INSIGHT */}
      <div
        style={{
          ...card,
          background: "linear-gradient(135deg, #6366f1, #9333ea)",
          color: "white",
        }}
      >
        <h3 style={{ fontSize: "18px", fontWeight: "600" }}>🧠 AI Insight</h3>
        <p style={{ marginTop: "10px", opacity: 0.9 }}>{insight}</p>
      </div>

      {/* GRID */}
      <div style={section}>
        {/* STREAK */}
        <div style={card}>
          <h3 style={{ ...title, color: "#6366f1" }}>🔥 Coding Streak</h3>
          <h2 style={{ fontSize: "36px", fontWeight: "700", color: "#6366f1" }}>
            {total}
          </h2>
          <p style={{ color: "#6b7280" }}>Sessions completed</p>
        </div>

        {/* SUCCESS RATE */}
        <div style={card}>
          <h3 style={{ ...title, color: "#10b981" }}>✅ Success Rate</h3>
          <h2 style={{ fontSize: "36px", fontWeight: "700", color: "#10b981" }}>
            {successRate}%
          </h2>
          <p style={{ color: "#6b7280" }}>Overall performance</p>
        </div>

        {/* DIFFICULTY */}
        <div style={card}>
          <h3 style={{ ...title, color: "#f59e0b" }}>📈 Difficulty Progress</h3>

          {[
            { label: "Easy", value: easy, color: "#22c55e" },
            { label: "Medium", value: medium, color: "#f59e0b" },
            { label: "Hard", value: hard, color: "#ef4444" },
          ].map((item) => (
            <div key={item.label} style={{ marginBottom: "12px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                <span>{item.label}</span>
                <span>{item.value}%</span>
              </div>

              <div style={{ height: "8px", background: "#e5e7eb", borderRadius: "5px" }}>
                <div
                  style={{
                    width: `${item.value}%`,
                    height: "8px",
                    background: item.color,
                    borderRadius: "5px",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* TOPIC STRENGTH (🔥 NEW BAR UI) */}
        <div style={card}>
          <h3 style={{ ...title, color: "#4f46e5" }}>📚 Topic Strength</h3>

          {topics.map((topic) => (
            <div key={topic.name} style={{ marginBottom: "12px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                <span>{topic.name}</span>
                <span>{topic.value}%</span>
              </div>

              <div style={{ height: "8px", background: "#e5e7eb", borderRadius: "5px" }}>
                <div
                  style={{
                    width: `${topic.value}%`,
                    height: "8px",
                    background: topic.color,
                    borderRadius: "5px",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* RECOMMENDATIONS */}
        <div style={card}>
          <h3 style={{ ...title, color: "#0ea5e9" }}>🎯 Recommended Problems</h3>
          <ul style={{ paddingLeft: "16px", color: "#374151" }}>
            <li>Practice loops with patterns</li>
            <li>Try array-based problems</li>
            <li>Work on condition logic</li>
          </ul>
        </div>

        {/* ACTIVITY */}
        <div style={card}>
          <h3 style={{ ...title, color: "#8b5cf6" }}>🕒 Recent Activity</h3>

          {total === 0 ? (
            <p style={{ color: "#6b7280" }}>No activity yet.</p>
          ) : (
            attempts.slice(0, 4).map((attempt) => (
              <div
                key={attempt.id}
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <span>
                  {attempt.status === "Success" ? "✅" : "❌"} {attempt.status}
                </span>
                <br />
                <small style={{ color: "#9ca3af" }}>
                  {attempt.timestamp}
                </small>
              </div>
            ))
          )}
        </div>

        {/* ACHIEVEMENTS */}
        <div style={card}>
          <h3 style={{ ...title, color: "#f43f5e" }}>🏆 Achievements</h3>

          {successCount >= 5 && <p>🏆 5 Successful Runs</p>}
          {successCount >= 10 && <p>🔥 10+ Successes</p>}
          {total >= 15 && <p>🚀 Active Learner</p>}

          {total === 0 && <p style={{ color: "#6b7280" }}>No achievements yet</p>}
        </div>
      </div>
    </section>
  );
}

export default Progress;