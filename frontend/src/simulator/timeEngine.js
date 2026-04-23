import { buildTimeComplexityTimeline } from "./timeComplexityVisualizer";

function getTimeLineExplanation({ lineNumber, event }) {
  if (!lineNumber) return "Press Play and follow the highlighted line.";

  if (event?.event === "show_calculation") {
    return `Final answer: O(${event?.result || "log n"}).`;
  }

  if (lineNumber === 2) return "We store the number once. That is a single constant-time step.";
  if (lineNumber === 3) return "We make a result variable. This only happens once, so it is O(1).";
  if (lineNumber === 4) return "This loop keeps checking the number until it becomes 0. Each digit is handled once, so the loop grows with the number of digits.";
  if (lineNumber === 5) return "We take the last digit using % 10. This is a quick constant-time operation.";
  if (lineNumber === 6) return "We print one digit. Printing a single value is constant time.";
  if (lineNumber === 7) return "We remove the last digit with // 10. The number gets smaller each round, so the loop finishes after about one pass per digit.";
  if (lineNumber === 9) return "The total work follows the digits in the number, so the final time complexity is O(log n).";

  if (event?.event === "enter_loop") return "This loop repeats for each digit.";
  return "This line does one small step. Time: O(1).";
}

function runTimeComplexityEngine(parsedRepresentation) {
  return buildTimeComplexityTimeline(parsedRepresentation);
}

export { runTimeComplexityEngine, getTimeLineExplanation };
