export const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    topics: ["Array", "Hash Map"],
    companyTag: "Companies",
    hintLabel: "Hint",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    note1:
      "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    note2: "You can return the answer in any order.",
    examples: [
      {
        label: "Example 1",
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation:
          "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        label: "Example 2",
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
      {
        label: "Example 3",
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    followUp:
      "Can you come up with an algorithm that is less than O(n^2) time complexity?",
    beginnerTips: [
      "Start with a brute-force solution using two loops.",
      "Then think about how to remember previously seen numbers.",
      "A HashMap can help reduce the time complexity.",
    ],
  },
];
