import { studyTopics } from "./studyTopics.js";

const GENERAL_DISTRACTORS = [
  "Skipping the chapter summary",
  "Memorizing syntax without concepts",
  "Ignoring compiler feedback",
  "Changing code randomly",
  "Avoiding small examples",
  "Reading only the final answer",
];

function uniqueValues(values) {
  return values.filter((value, index, array) => value && array.indexOf(value) === index);
}

function optionSet(correct, candidates, questionIndex) {
  const distractors = uniqueValues([...candidates, ...GENERAL_DISTRACTORS]).filter(
    (item) => item !== correct
  );
  const options = [correct, ...distractors].slice(0, 4);
  const correctIndex = questionIndex % 4;
  const [answer] = options.splice(0, 1);
  options.splice(correctIndex, 0, answer);
  return { options, correctIndex };
}

function makeQuestion(text, correct, candidates, questionIndex) {
  const { options, correctIndex } = optionSet(correct, candidates, questionIndex);
  return { question: text, options, correctIndex };
}

function buildQuiz(topic) {
  const headings = topic.sections.map((section) => section.heading);
  const otherHeadings = studyTopics
    .filter((item) => item.id !== topic.id)
    .flatMap((item) => item.sections.map((section) => section.heading));
  const relatedIdeas = uniqueValues([...headings, ...otherHeadings]);
  const otherTitles = studyTopics
    .filter((item) => item.id !== topic.id)
    .map((item) => item.title);
  const topicLabels = uniqueValues(studyTopics.map((item) => item.topic));

  const getHeading = (index) => headings[index % headings.length];
  const getNextHeading = (index) => headings[(index + 1) % headings.length];

  return [
    makeQuestion(
      `What is the main study focus of Chapter ${topic.chapter}?`,
      topic.title,
      otherTitles,
      0
    ),
    makeQuestion(
      `Which concept is covered in "${topic.title}"?`,
      getHeading(0),
      relatedIdeas,
      1
    ),
    makeQuestion(
      `Which topic label best matches "${topic.shortTitle}"?`,
      topic.topic,
      topicLabels,
      2
    ),
    makeQuestion(
      `After reading "${getHeading(0)}", which related section should you connect it with in this chapter?`,
      getNextHeading(0),
      relatedIdeas,
      3
    ),
    makeQuestion(
      `Which section would help a beginner review "${getHeading(1)}" in this chapter?`,
      getHeading(1),
      relatedIdeas,
      0
    ),
    makeQuestion(
      `Which chapter section is part of "${topic.title}"?`,
      getHeading(2),
      relatedIdeas,
      1
    ),
    makeQuestion(
      `Which idea should you revisit before practicing problems related to "${topic.topic}"?`,
      getHeading(3),
      relatedIdeas,
      2
    ),
    makeQuestion(
      `Which section belongs to the current concept instead of another Java chapter?`,
      getHeading(4),
      relatedIdeas,
      3
    ),
    makeQuestion(
      `What should you use to summarize the key learning points for "${topic.shortTitle}"?`,
      getHeading(0),
      relatedIdeas,
      0
    ),
    makeQuestion(
      `Which section title is most useful for checking your understanding of "${topic.title}"?`,
      getHeading(headings.length - 1),
      relatedIdeas,
      1
    ),
  ];
}

export const studyQuizzes = Object.fromEntries(
  studyTopics.map((topic) => [topic.id, buildQuiz(topic)])
);
