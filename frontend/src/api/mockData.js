// ============================================================
// Codexa AI — Mock data layer
// ============================================================
// These helpers return data in the same shape the backend will
// eventually produce, so the frontend can be built and tested
// without a live Flask server. Each function returns a Promise
// to mimic a real network call and so swapping in the real
// client.js helpers later is a drop-in change.
// ============================================================

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

// Mirrors the response of GET /api/learning-summary/:user_id
// that topic_analyzer.get_learning_summary() produces on the
// backend. Topics are classified as weak / improving / strong.
const MOCK_LEARNING_SUMMARY = {
  user_id: "demo_user",
  total_submissions: 47,
  successful_submissions: 28,
  success_rate: 0.596,

  // Aggregated topic performance — accuracy in [0, 1]
  topic_performance: [
    { topic: "Java Basics", attempts: 12, successes: 11, accuracy: 0.92 },
    { topic: "Conditions", attempts: 10, successes: 7, accuracy: 0.7 },
    { topic: "Loops", attempts: 15, successes: 7, accuracy: 0.47 },
    { topic: "Arrays", attempts: 10, successes: 3, accuracy: 0.3 },
  ],

  // Classified groupings produced by the backend analyzer
  strong_topics: ["Java Basics"],
  improving_topics: ["Conditions"],
  weak_topics: ["Loops", "Arrays"],

  // Error type counters produced by submission_service
  error_breakdown: [
    { type: "SyntaxError", count: 11 },
    { type: "NullPointerException", count: 5 },
    { type: "ArrayIndexOutOfBounds", count: 4 },
    { type: "ClassCastException", count: 2 },
    { type: "LogicError", count: 8 },
  ],

  // Activity streak data — calendar dates where the user coded
  streak: {
    current: 4,
    longest: 11,
    active_dates: [
      "2026-04-02",
      "2026-04-03",
      "2026-04-05",
      "2026-04-06",
      "2026-04-07",
      "2026-04-08",
      "2026-04-09",
      "2026-04-10",
    ],
  },

  // Recent submissions, newest first
  recent_submissions: [
    {
      id: "sub_0047",
      problem_id: 14,
      problem_title: "Factorial of N",
      status: "RuntimeError",
      topic: "Loops",
      timestamp: "2026-04-10T11:42:00",
    },
    {
      id: "sub_0046",
      problem_id: 19,
      problem_title: "Print Array Elements",
      status: "Success",
      topic: "Arrays",
      timestamp: "2026-04-10T11:05:00",
    },
    {
      id: "sub_0045",
      problem_id: 9,
      problem_title: "Grade Calculator",
      status: "Success",
      topic: "Conditions",
      timestamp: "2026-04-09T21:12:00",
    },
    {
      id: "sub_0044",
      problem_id: 13,
      problem_title: "Sum of 1 to N",
      status: "CompilationError",
      topic: "Loops",
      timestamp: "2026-04-09T20:44:00",
    },
    {
      id: "sub_0043",
      problem_id: 1,
      problem_title: "Hello, Codexa!",
      status: "Success",
      topic: "Java Basics",
      timestamp: "2026-04-09T18:30:00",
    },
  ],

  // Personalized recommendations generated from weak topics
  recommendations: [
    {
      problem_id: 13,
      title: "Sum of 1 to N",
      reason: "Strengthen loop fundamentals",
      topic: "Loops",
      difficulty: "Easy",
    },
    {
      problem_id: 19,
      title: "Print Array Elements",
      reason: "Build array iteration intuition",
      topic: "Arrays",
      difficulty: "Easy",
    },
    {
      problem_id: 15,
      title: "Multiplication Table",
      reason: "Practice nested output with loops",
      topic: "Loops",
      difficulty: "Medium",
    },
  ],
};

export async function fetchLearningSummary(/* userId */) {
  await delay();
  return structuredClone(MOCK_LEARNING_SUMMARY);
}

// Deterministic insight line derived from the summary, mirroring
// what the backend encouragement engine would eventually return.
export function deriveInsight(summary) {
  if (!summary || !summary.total_submissions) {
    return "Write your first line of Java to unlock personalized insights.";
  }
  const { success_rate, weak_topics, strong_topics } = summary;
  if (success_rate >= 0.8) {
    return `Exceptional work — your ${strong_topics[0] || "core"} skills are rock solid. Ready for harder challenges?`;
  }
  if (success_rate >= 0.55) {
    return `Strong progress. Focus next on ${weak_topics[0] || "edge cases"} to push past the plateau.`;
  }
  return `Keep going. ${weak_topics[0] || "Fundamentals"} need attention — try one easy problem to rebuild momentum.`;
}

// Feature flag for when the real backend is wired up.
export const USE_MOCK_DATA = true;
