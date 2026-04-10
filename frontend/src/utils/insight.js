// ============================================================
// Codexa AI — insight generator
// ============================================================
// Deterministic one-liner derived from the backend learning
// summary, used by the Progress page's "Codexa Insight" banner.
// Kept in its own module (instead of the API layer) so it can
// be unit tested in isolation and doesn't force pages to depend
// on the mock data module that seeded it originally.
// ============================================================

export function deriveInsight(summary) {
  if (!summary || !summary.total_submissions) {
    return "Write your first line of Java to unlock personalized insights.";
  }

  const successRate = summary.success_rate ?? 0;
  const weakTopics = summary.weak_topics ?? [];
  const strongTopics = summary.strong_topics ?? [];

  if (successRate >= 0.8) {
    return `Exceptional work — your ${strongTopics[0] || "core"} skills are rock solid. Ready for harder challenges?`;
  }
  if (successRate >= 0.55) {
    return `Strong progress. Focus next on ${weakTopics[0] || "edge cases"} to push past the plateau.`;
  }
  return `Keep going. ${weakTopics[0] || "Fundamentals"} need attention — try one easy problem to rebuild momentum.`;
}
