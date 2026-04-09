function Progress({ attempts }) {
  const total = attempts.length;

  const successCount = attempts.filter((a) => a.status === "Success").length;

  const successRate =
    total > 0 ? ((successCount / total) * 100).toFixed(1) : 0;

  let insight = "";

  if (total === 0) {
    insight = "Start practicing to see insights.";
  } else if (successRate >= 80) {
    insight =
      "Great job! You are performing very well. Try more complex problems.";
  } else if (successRate >= 50) {
    insight =
      "Good progress. Focus on fixing small errors to improve further.";
  } else {
    insight =
      "You are facing difficulties. Review basic concepts and practice more.";
  }

  return (
    <section className="page">
      <div className="page-header">
        <h2>Progress</h2>
        <p>Track your coding performance and improvement.</p>
      </div>

      {total === 0 && (
        <div className="card">
          <h3>No data yet</h3>
          <p>Run some code to see your progress here.</p>
        </div>
      )}

      <div className="card insight-card">
        <h3>AI Insight</h3>
        <p>{insight}</p>
      </div>
    </section>
  );
}

export default Progress;
