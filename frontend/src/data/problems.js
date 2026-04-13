// Problem catalog for the Codexa AI practice dashboard.
// 4 topics (Java Basics, Conditions, Loops, Arrays) × 6 problems each
// (2 Easy, 2 Medium, 2 Hard) = 24 problems total.
//
// Each problem embeds its own `starterCode` so the Practice page can load
// a topic-appropriate scaffold instead of a single global template.

export const problems = [
  // ─────────────────────────────────────────────────────────────────────
  // JAVA BASICS
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 1,
    title: "Hello, Codexa!",
    topic: "Java Basics",
    difficulty: "Easy",
    topics: ["Java Basics", "Output"],
    description:
      "Write a Java program that prints the exact line `Hello, Codexa!` (without quotes) to the console.",
    note1:
      "The output must match exactly, including capitalization, the comma, and the exclamation mark.",
    note2:
      "Use System.out.println to print to standard output.",
    examples: [
      {
        label: "Example 1",
        input: "(no input)",
        output: "Hello, Codexa!",
        explanation:
          "The program prints the greeting on its own line.",
      },
    ],
    constraints: [
      "The output must be exactly `Hello, Codexa!` followed by a newline.",
      "Do not print any additional text.",
    ],
    followUp:
      "Can you print the greeting three times using three separate println calls?",
    beginnerTips: [
      "Every Java program starts from the `main` method.",
      "`System.out.println` prints the given text and moves to the next line.",
      "Strings are wrapped in double quotes.",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        // Print the greeting below
    }
}`,
  },
  {
    id: 2,
    title: "Swap Two Variables",
    topic: "Java Basics",
    difficulty: "Easy",
    topics: ["Java Basics", "Variables"],
    description:
      "Two integer variables `a` and `b` are declared with initial values 5 and 10. Swap their values and print them on a single line separated by a space.",
    note1:
      "You may use a temporary variable or any Java syntax you know.",
    note2:
      "The final output must show the swapped values in the order: value of a, then value of b.",
    examples: [
      {
        label: "Example 1",
        input: "a = 5, b = 10",
        output: "10 5",
        explanation:
          "After swapping, `a` holds 10 and `b` holds 5.",
      },
    ],
    constraints: [
      "Do not hardcode the final values — perform an actual swap.",
      "Print both values on the same line separated by a single space.",
    ],
    followUp:
      "Can you swap the two values without using a third temporary variable?",
    beginnerTips: [
      "A temporary variable is the simplest way to swap.",
      "`System.out.println(a + \" \" + b)` prints both values together.",
      "Integer operations like +, -, and XOR can also swap without a temp.",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        int a = 5;
        int b = 10;
        // Swap the values of a and b here
        System.out.println(a + " " + b);
    }
}`,
  },
  {
    id: 3,
    title: "Area of a Circle",
    topic: "Java Basics",
    difficulty: "Medium",
    topics: ["Java Basics", "Math"],
    description:
      "Given a radius of 7.0 (already declared), compute and print the area of a circle. Use `Math.PI` for the value of π and print the result rounded to two decimal places.",
    note1:
      "Area = π × r × r.",
    note2:
      "Use `String.format(\"%.2f\", value)` to round to two decimal places.",
    examples: [
      {
        label: "Example 1",
        input: "radius = 7.0",
        output: "153.94",
        explanation:
          "π × 7 × 7 ≈ 153.9380 which rounds to 153.94.",
      },
    ],
    constraints: [
      "Use `Math.PI` rather than hardcoding 3.14.",
      "Print the result rounded to exactly two decimal places.",
    ],
    followUp:
      "Can you extend the program to also print the circumference?",
    beginnerTips: [
      "`Math.PI` is a `double` constant — use `double` for radius and area.",
      "Multiplication uses the * operator.",
      "`String.format` produces a rounded string you can pass to println.",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        double radius = 7.0;
        // Compute the area and print it rounded to 2 decimals
    }
}`,
  },
  {
    id: 4,
    title: "Celsius to Fahrenheit",
    topic: "Java Basics",
    difficulty: "Medium",
    topics: ["Java Basics", "Math"],
    description:
      "A Celsius temperature `c` is declared with a value of 37.0. Convert it to Fahrenheit and print the result rounded to one decimal place.",
    note1:
      "The conversion formula is: F = (C × 9/5) + 32.",
    note2:
      "Watch out for integer division — use doubles or the literal 9.0/5.0.",
    examples: [
      {
        label: "Example 1",
        input: "c = 37.0",
        output: "98.6",
        explanation:
          "(37 × 9/5) + 32 = 66.6 + 32 = 98.6.",
      },
    ],
    constraints: [
      "The output must be rounded to one decimal place.",
      "Do not hardcode the result.",
    ],
    followUp:
      "Can you also compute and print the Kelvin equivalent on the next line?",
    beginnerTips: [
      "Use `double` variables for the math to avoid integer division.",
      "Writing `9.0 / 5.0` forces floating-point division.",
      "`String.format(\"%.1f\", value)` rounds to one decimal place.",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        double c = 37.0;
        // Convert c to Fahrenheit and print it rounded to 1 decimal
    }
}`,
  },
  {
    id: 5,
    title: "Simple Interest Calculator",
    topic: "Java Basics",
    difficulty: "Hard",
    topics: ["Java Basics", "Math"],
    description:
      "Given principal = 1500.0, annual rate = 4.3, and time = 3.0 years (all declared), compute the simple interest and print both the interest and the total amount on separate lines, each rounded to two decimal places.",
    note1:
      "Simple Interest = (Principal × Rate × Time) / 100.",
    note2:
      "Total Amount = Principal + Simple Interest.",
    examples: [
      {
        label: "Example 1",
        input: "principal = 1500.0, rate = 4.3, time = 3.0",
        output: "193.50\n1693.50",
        explanation:
          "Interest = (1500 × 4.3 × 3) / 100 = 193.5. Total = 1500 + 193.5 = 1693.5.",
      },
    ],
    constraints: [
      "Use `double` throughout to preserve precision.",
      "Print interest first, then total amount, each rounded to 2 decimals.",
    ],
    followUp:
      "Can you rewrite the calculation as a reusable method that takes the three inputs and returns the interest?",
    beginnerTips: [
      "Mixing int and double in one expression promotes the result to double.",
      "Use separate `println` calls to put the two values on different lines.",
      "`String.format(\"%.2f\", value)` gives a consistently formatted string.",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        double principal = 1500.0;
        double rate = 4.3;
        double time = 3.0;
        // Compute and print interest and total amount (each rounded to 2 decimals)
    }
}`,
  },
  {
    id: 6,
    title: "Reverse a String",
    topic: "Java Basics",
    difficulty: "Hard",
    topics: ["Java Basics", "Strings"],
    description:
      "A string `text` is declared with the value `\"Codexa\"`. Reverse the string and print the reversed version.",
    note1:
      "You may use any approach: StringBuilder, a char array, or a manual loop.",
    note2:
      "Do not hardcode the reversed string in your output.",
    examples: [
      {
        label: "Example 1",
        input: "text = \"Codexa\"",
        output: "axedoC",
        explanation:
          "Reading the characters from the end to the start gives `axedoC`.",
      },
    ],
    constraints: [
      "The reversal must be computed at runtime.",
      "Print only the reversed string with no extra text.",
    ],
    followUp:
      "Can you also detect and print whether the original string is a palindrome?",
    beginnerTips: [
      "`StringBuilder` has a built-in `reverse()` method.",
      "`text.length()` returns the number of characters.",
      "`text.charAt(i)` returns the character at index `i` (0-based).",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        String text = "Codexa";
        // Reverse the string and print it
    }
}`,
  },

  // ─────────────────────────────────────────────────────────────────────
  // CONDITIONS
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 7,
    title: "Even or Odd",
    topic: "Conditions",
    difficulty: "Easy",
    topics: ["Conditions", "Modulo"],
    description:
      "A variable `n` is declared with the value 17. Print `Even` if `n` is divisible by 2, otherwise print `Odd`.",
    note1:
      "Use the modulo operator `%` to test divisibility.",
    note2:
      "The output is exactly one word: either `Even` or `Odd`.",
    examples: [
      {
        label: "Example 1",
        input: "n = 17",
        output: "Odd",
        explanation:
          "17 % 2 == 1, so 17 is odd.",
      },
      {
        label: "Example 2",
        input: "n = 42",
        output: "Even",
        explanation:
          "42 % 2 == 0, so 42 is even.",
      },
    ],
    constraints: [
      "Use an `if` / `else` statement — do not hardcode the answer.",
      "Output must be exactly `Even` or `Odd` with matching capitalization.",
    ],
    followUp:
      "Can you handle negative numbers correctly as well?",
    beginnerTips: [
      "`n % 2` gives the remainder after dividing by 2.",
      "An `if` condition must be a boolean expression like `n % 2 == 0`.",
      "`System.out.println(\"Even\")` prints the word Even.",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        int n = 17;
        // Print "Even" if n is even, otherwise "Odd"
    }
}`,
  },
  {
    id: 8,
    title: "Positive, Negative, or Zero",
    topic: "Conditions",
    difficulty: "Easy",
    topics: ["Conditions", "If-Else"],
    description:
      "Given an integer `n` declared with the value -5, print `Positive` if it is greater than 0, `Negative` if it is less than 0, and `Zero` otherwise.",
    note1:
      "Use an `if` / `else if` / `else` chain.",
    note2:
      "Output is exactly one word with matching capitalization.",
    examples: [
      {
        label: "Example 1",
        input: "n = -5",
        output: "Negative",
      },
      {
        label: "Example 2",
        input: "n = 0",
        output: "Zero",
      },
      {
        label: "Example 3",
        input: "n = 12",
        output: "Positive",
      },
    ],
    constraints: [
      "Exactly one of the three words must be printed.",
      "Do not print any extra text.",
    ],
    followUp:
      "Can you rewrite this using a single ternary expression (nested)?",
    beginnerTips: [
      "`if-else if-else` handles three mutually exclusive branches.",
      "Comparisons return a boolean value: `n > 0`, `n < 0`, `n == 0`.",
      "Pay attention to string capitalization in the output.",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        int n = -5;
        // Print Positive / Negative / Zero based on n
    }
}`,
  },
  {
    id: 9,
    title: "Grade Calculator",
    topic: "Conditions",
    difficulty: "Medium",
    topics: ["Conditions", "If-Else"],
    description:
      "A variable `marks` holds an integer test score (0–100). Print a letter grade using these rules: 90 and above → A, 80–89 → B, 70–79 → C, 60–69 → D, below 60 → F. Use the declared value `marks = 76`.",
    note1:
      "Use an `if` / `else if` chain.",
    note2:
      "Print only the letter, nothing else.",
    examples: [
      {
        label: "Example 1",
        input: "marks = 76",
        output: "C",
      },
      {
        label: "Example 2",
        input: "marks = 91",
        output: "A",
      },
      {
        label: "Example 3",
        input: "marks = 59",
        output: "F",
      },
    ],
    constraints: [
      "Marks are guaranteed to be between 0 and 100 inclusive.",
      "The printed grade must be a single uppercase letter.",
    ],
    followUp:
      "Can you add a plus/minus modifier (e.g., B+, B, B-) based on the last digit?",
    beginnerTips: [
      "Order your `else if` branches from highest to lowest threshold.",
      "Each branch should only need to check the lower bound once the higher bounds have been ruled out.",
      "Use `>=` so boundary values like 90 map to A.",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        int marks = 76;
        // Print the grade letter based on the rules above
    }
}`,
  },
  {
    id: 10,
    title: "Leap Year Check",
    topic: "Conditions",
    difficulty: "Medium",
    topics: ["Conditions", "Logic"],
    description:
      "Given a year declared as `year = 2024`, print `Leap` if it is a leap year, otherwise print `Not Leap`. A leap year is divisible by 4, except for years divisible by 100 but not by 400.",
    note1:
      "Combine the three rules with `&&` and `||`.",
    note2:
      "Year 2000 is a leap year, but 1900 is not.",
    examples: [
      {
        label: "Example 1",
        input: "year = 2024",
        output: "Leap",
      },
      {
        label: "Example 2",
        input: "year = 1900",
        output: "Not Leap",
      },
      {
        label: "Example 3",
        input: "year = 2000",
        output: "Leap",
      },
    ],
    constraints: [
      "The check must use the standard Gregorian leap year rules.",
      "Output is either `Leap` or `Not Leap` — exact capitalization.",
    ],
    followUp:
      "Can you extract the leap year check into a helper method that returns a boolean?",
    beginnerTips: [
      "A leap year condition can be written as: (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0).",
      "Use parentheses to group the conditions clearly.",
      "Print the exact strings with matching spaces.",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        int year = 2024;
        // Print "Leap" or "Not Leap"
    }
}`,
  },
  {
    id: 11,
    title: "Largest of Three Numbers",
    topic: "Conditions",
    difficulty: "Hard",
    topics: ["Conditions", "Comparison"],
    description:
      "Three integer variables `a`, `b`, and `c` are declared with values 14, 27, and 9. Without using `Math.max`, print the largest of the three.",
    note1:
      "Use nested `if` statements or combined boolean conditions.",
    note2:
      "Print only the number, nothing else.",
    examples: [
      {
        label: "Example 1",
        input: "a = 14, b = 27, c = 9",
        output: "27",
      },
    ],
    constraints: [
      "Do not use `Math.max` or any library helper.",
      "Assume all three numbers may be equal.",
    ],
    followUp:
      "Can you print the smallest number as well, on the next line?",
    beginnerTips: [
      "`if (a >= b && a >= c)` means `a` is at least as large as the other two.",
      "Only one of the three branches should print.",
      "Test with equal numbers to make sure your comparisons use `>=` where needed.",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        int a = 14;
        int b = 27;
        int c = 9;
        // Print the largest of a, b, c
    }
}`,
  },
  {
    id: 12,
    title: "Quadratic Roots Nature",
    topic: "Conditions",
    difficulty: "Hard",
    topics: ["Conditions", "Math"],
    description:
      "Given coefficients a = 1, b = -3, c = 2 for the equation ax² + bx + c = 0, print the nature of the roots: `Real and Distinct`, `Real and Equal`, or `Complex`.",
    note1:
      "Compute the discriminant: d = b² − 4ac.",
    note2:
      "d > 0 → real and distinct, d == 0 → real and equal, d < 0 → complex.",
    examples: [
      {
        label: "Example 1",
        input: "a = 1, b = -3, c = 2",
        output: "Real and Distinct",
        explanation:
          "d = 9 - 8 = 1, which is > 0.",
      },
      {
        label: "Example 2",
        input: "a = 1, b = 2, c = 1",
        output: "Real and Equal",
      },
      {
        label: "Example 3",
        input: "a = 1, b = 0, c = 4",
        output: "Complex",
      },
    ],
    constraints: [
      "Assume `a` is always non-zero.",
      "Use `int` or `double` — the result must match exactly one of the three strings.",
    ],
    followUp:
      "Can you also compute and print the actual roots when they are real?",
    beginnerTips: [
      "Watch out for operator precedence: `b * b - 4 * a * c` evaluates correctly.",
      "Use an `if` / `else if` / `else` chain to classify the three cases.",
      "Match the output strings exactly, including spaces and capitalization.",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        int a = 1;
        int b = -3;
        int c = 2;
        // Print the nature of the roots
    }
}`,
  },

  // ─────────────────────────────────────────────────────────────────────
  // LOOPS
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 13,
    title: "Sum of First N Numbers",
    topic: "Loops",
    difficulty: "Easy",
    topics: ["Loops", "For Loop"],
    description:
      "A variable `n` is declared with the value 10. Use a `for` loop to compute and print the sum 1 + 2 + 3 + ... + n.",
    note1:
      "Do not use the closed-form formula n*(n+1)/2.",
    note2:
      "Print only the final sum.",
    examples: [
      {
        label: "Example 1",
        input: "n = 10",
        output: "55",
        explanation:
          "1 + 2 + ... + 10 = 55.",
      },
    ],
    constraints: [
      "You must use a loop to perform the summation.",
      "Assume `n` is a non-negative integer.",
    ],
    followUp:
      "Can you print the sum of only the even numbers from 1 to n?",
    beginnerTips: [
      "Declare a `sum` variable initialized to 0 before the loop.",
      "Inside the loop, add the loop counter to `sum`.",
      "A classic pattern is `for (int i = 1; i <= n; i++)`.",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        int n = 10;
        // Use a loop to compute and print the sum 1 + 2 + ... + n
    }
}`,
  },
  {
    id: 14,
    title: "Factorial of N",
    topic: "Loops",
    difficulty: "Easy",
    topics: ["Loops", "Math"],
    description:
      "A variable `n` is declared with the value 6. Compute the factorial n! using a loop and print the result.",
    note1:
      "Factorial: n! = 1 × 2 × 3 × ... × n. By convention 0! = 1.",
    note2:
      "Use a `long` to avoid overflow for larger values of n.",
    examples: [
      {
        label: "Example 1",
        input: "n = 6",
        output: "720",
        explanation:
          "6! = 1 × 2 × 3 × 4 × 5 × 6 = 720.",
      },
    ],
    constraints: [
      "Use a loop (for or while).",
      "Assume `n` is between 0 and 20.",
    ],
    followUp:
      "Can you rewrite the factorial using recursion instead of a loop?",
    beginnerTips: [
      "Initialize `result` to 1 before the loop (not 0 — you are multiplying).",
      "Multiply `result` by `i` for every iteration.",
      "Use `long` to hold the result because factorials grow fast.",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        int n = 6;
        // Compute and print n!
    }
}`,
  },
  {
    id: 15,
    title: "Multiplication Table",
    topic: "Loops",
    difficulty: "Medium",
    topics: ["Loops", "For Loop"],
    description:
      "A variable `n` is declared with the value 7. Print the multiplication table of `n` from 1 to 10. Each line must be formatted as `n x i = result`.",
    note1:
      "There should be exactly 10 lines of output.",
    note2:
      "Use the lowercase letter x with single spaces around it.",
    examples: [
      {
        label: "Example 1",
        input: "n = 7",
        output: "7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n... (up to 7 x 10 = 70)",
      },
    ],
    constraints: [
      "Use a single for loop from 1 to 10.",
      "Match the line format exactly, including spaces around `x` and `=`.",
    ],
    followUp:
      "Can you print multiplication tables for numbers 1 through 5 using nested loops?",
    beginnerTips: [
      "String concatenation with `+` builds each line: `n + \" x \" + i + \" = \" + (n * i)`.",
      "`println` puts each line on its own row.",
      "Use `i` as the loop variable that goes from 1 to 10.",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        int n = 7;
        // Print the multiplication table of n from 1 to 10
    }
}`,
  },
  {
    id: 16,
    title: "Count Digits of a Number",
    topic: "Loops",
    difficulty: "Medium",
    topics: ["Loops", "While Loop"],
    description:
      "A variable `n` is declared with the value 40562. Use a `while` loop to count and print how many digits it has. Do not convert the number to a string.",
    note1:
      "You can strip the last digit each iteration with `n = n / 10`.",
    note2:
      "Be careful: the loop must run at least once so that `0` reports 1 digit.",
    examples: [
      {
        label: "Example 1",
        input: "n = 40562",
        output: "5",
      },
      {
        label: "Example 2",
        input: "n = 0",
        output: "1",
      },
    ],
    constraints: [
      "Do not use `String.valueOf(n).length()`.",
      "Handle the n == 0 case correctly.",
    ],
    followUp:
      "Can you also print the sum of the digits on the next line?",
    beginnerTips: [
      "Use a `do-while` or initialize count to 1 so n == 0 works.",
      "Each iteration: `count++` then `n = n / 10`.",
      "Integer division truncates toward zero in Java.",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        int n = 40562;
        // Count and print the number of digits in n
    }
}`,
  },
  {
    id: 17,
    title: "Fibonacci Series",
    topic: "Loops",
    difficulty: "Hard",
    topics: ["Loops", "Math"],
    description:
      "Given `n = 8`, print the first `n` terms of the Fibonacci sequence on a single line, separated by spaces. The sequence starts with 0 and 1.",
    note1:
      "Each term is the sum of the two previous terms.",
    note2:
      "Print the numbers on one line with a single space between them.",
    examples: [
      {
        label: "Example 1",
        input: "n = 8",
        output: "0 1 1 2 3 5 8 13",
      },
    ],
    constraints: [
      "Use `int` or `long` — values stay well within range for small n.",
      "Do not print a trailing space, and do not add a leading space.",
    ],
    followUp:
      "Can you print only the even Fibonacci numbers below a given limit?",
    beginnerTips: [
      "Track two variables: the previous and current Fibonacci values.",
      "Use a `StringBuilder` to avoid trailing spaces in the output.",
      "Update the pair inside the loop: new current = previous + current.",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        int n = 8;
        // Print the first n Fibonacci numbers on one line
    }
}`,
  },
  {
    id: 18,
    title: "Prime Number Check",
    topic: "Loops",
    difficulty: "Hard",
    topics: ["Loops", "Math"],
    description:
      "A variable `n` is declared with the value 29. Use a loop to determine whether `n` is a prime number. Print `Prime` or `Not Prime`.",
    note1:
      "A prime number is greater than 1 and divisible only by 1 and itself.",
    note2:
      "You only need to test divisors up to √n for efficiency.",
    examples: [
      {
        label: "Example 1",
        input: "n = 29",
        output: "Prime",
      },
      {
        label: "Example 2",
        input: "n = 15",
        output: "Not Prime",
      },
      {
        label: "Example 3",
        input: "n = 1",
        output: "Not Prime",
      },
    ],
    constraints: [
      "Handle the edge cases 0 and 1 correctly (both are Not Prime).",
      "Output must match the exact strings.",
    ],
    followUp:
      "Can you print the list of all primes below n instead?",
    beginnerTips: [
      "Start with a `boolean isPrime = true` flag.",
      "Loop from 2 up to `Math.sqrt(n)`, checking `n % i == 0`.",
      "Break out of the loop as soon as you find a divisor.",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        int n = 29;
        // Print "Prime" or "Not Prime"
    }
}`,
  },

  // ─────────────────────────────────────────────────────────────────────
  // ARRAYS
  // ─────────────────────────────────────────────────────────────────────
  {
    id: 19,
    title: "Print Array Elements",
    topic: "Arrays",
    difficulty: "Easy",
    topics: ["Arrays", "For Loop"],
    description:
      "An array `nums = {4, 9, 2, 7, 1}` is declared. Use a loop to print each element on its own line.",
    note1:
      "Do not use `Arrays.toString` — iterate the array yourself.",
    note2:
      "Exactly one element per line, no extra text.",
    examples: [
      {
        label: "Example 1",
        input: "nums = {4, 9, 2, 7, 1}",
        output: "4\n9\n2\n7\n1",
      },
    ],
    constraints: [
      "You must iterate the array.",
      "Print elements in their original order.",
    ],
    followUp:
      "Can you print the array in reverse order on the next attempt?",
    beginnerTips: [
      "`nums.length` gives the number of elements in the array.",
      "Array indexes start at 0, so use `i = 0; i < nums.length`.",
      "A for-each loop `for (int x : nums)` also works.",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        int[] nums = {4, 9, 2, 7, 1};
        // Print each element on its own line
    }
}`,
  },
  {
    id: 20,
    title: "Sum of Array",
    topic: "Arrays",
    difficulty: "Easy",
    topics: ["Arrays", "Aggregation"],
    description:
      "Given `nums = {3, 8, 2, 11, 6}`, compute the sum of all elements and print it.",
    note1:
      "Use a loop to accumulate the sum.",
    note2:
      "Print only the final sum.",
    examples: [
      {
        label: "Example 1",
        input: "nums = {3, 8, 2, 11, 6}",
        output: "30",
      },
    ],
    constraints: [
      "The array may contain any non-negative integers.",
      "Do not use any external library helpers.",
    ],
    followUp:
      "Can you also print the average (sum divided by length), rounded to 2 decimals?",
    beginnerTips: [
      "Initialize `sum = 0` before the loop.",
      "Inside the loop, do `sum += nums[i]` or `sum += x` with for-each.",
      "Print `sum` only once — after the loop finishes.",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        int[] nums = {3, 8, 2, 11, 6};
        // Compute and print the sum of all elements
    }
}`,
  },
  {
    id: 21,
    title: "Maximum in Array",
    topic: "Arrays",
    difficulty: "Medium",
    topics: ["Arrays", "Comparison"],
    description:
      "Given `nums = {12, 45, 7, 89, 23, 56}`, find and print the maximum value. Do not use `Math.max` or `Arrays.stream`.",
    note1:
      "Initialize a `max` variable to the first element of the array.",
    note2:
      "Walk through the rest of the array and update `max` when you find a larger element.",
    examples: [
      {
        label: "Example 1",
        input: "nums = {12, 45, 7, 89, 23, 56}",
        output: "89",
      },
    ],
    constraints: [
      "Array is guaranteed to be non-empty.",
      "Do not use built-in max helpers.",
    ],
    followUp:
      "Can you also print the index of the maximum element?",
    beginnerTips: [
      "`int max = nums[0]` is a safe starting point for non-empty arrays.",
      "Loop from index 1 onwards for efficiency.",
      "Use `if (nums[i] > max) max = nums[i]`.",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        int[] nums = {12, 45, 7, 89, 23, 56};
        // Find and print the maximum value
    }
}`,
  },
  {
    id: 22,
    title: "Count Even Numbers",
    topic: "Arrays",
    difficulty: "Medium",
    topics: ["Arrays", "Conditions"],
    description:
      "Given `nums = {5, 12, 7, 8, 9, 14, 3, 6}`, count how many elements are even and print the count.",
    note1:
      "Use a loop and the modulo operator.",
    note2:
      "Print only the integer count.",
    examples: [
      {
        label: "Example 1",
        input: "nums = {5, 12, 7, 8, 9, 14, 3, 6}",
        output: "4",
        explanation:
          "The even numbers are 12, 8, 14, 6 — four in total.",
      },
    ],
    constraints: [
      "The array may be empty — in that case the count is 0.",
      "Do not use any stream API.",
    ],
    followUp:
      "Can you also print the count of odd numbers on the next line?",
    beginnerTips: [
      "Initialize a `count` variable to 0.",
      "Inside the loop, check `nums[i] % 2 == 0`.",
      "Print `count` after the loop finishes.",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        int[] nums = {5, 12, 7, 8, 9, 14, 3, 6};
        // Count and print how many elements are even
    }
}`,
  },
  {
    id: 23,
    title: "Reverse an Array",
    topic: "Arrays",
    difficulty: "Hard",
    topics: ["Arrays", "Two Pointers"],
    description:
      "Given `nums = {1, 2, 3, 4, 5}`, reverse the array in place (without creating a new array) and print the reversed elements separated by single spaces.",
    note1:
      "Use two pointers: one at the start, one at the end, and swap.",
    note2:
      "Move the pointers toward each other until they meet.",
    examples: [
      {
        label: "Example 1",
        input: "nums = {1, 2, 3, 4, 5}",
        output: "5 4 3 2 1",
      },
    ],
    constraints: [
      "Do not allocate a second array for the result.",
      "Print the elements on one line separated by single spaces, no trailing space.",
    ],
    followUp:
      "Can you generalize the swap into a helper method?",
    beginnerTips: [
      "Use a temporary variable for the swap: `int tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp;`.",
      "Stop when `i >= j`.",
      "Use a `StringBuilder` when printing to avoid trailing spaces.",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        int[] nums = {1, 2, 3, 4, 5};
        // Reverse in place and print with single spaces
    }
}`,
  },
  {
    id: 24,
    title: "Linear Search",
    topic: "Arrays",
    difficulty: "Hard",
    topics: ["Arrays", "Search"],
    description:
      "Given `nums = {10, 25, 37, 48, 59, 63}` and `target = 48`, find the index of the target using linear search. Print the index if found, or `-1` if the target is not in the array.",
    note1:
      "Return the first index where `nums[i] == target`.",
    note2:
      "If the target is not found, print `-1` exactly.",
    examples: [
      {
        label: "Example 1",
        input: "nums = {10, 25, 37, 48, 59, 63}, target = 48",
        output: "3",
      },
      {
        label: "Example 2",
        input: "nums = {10, 25, 37, 48, 59, 63}, target = 100",
        output: "-1",
      },
    ],
    constraints: [
      "Do not use `Arrays.asList` or any built-in search helpers.",
      "The array is not guaranteed to be sorted — use linear search, not binary search.",
    ],
    followUp:
      "Can you count how many times the target appears in the array instead?",
    beginnerTips: [
      "Track an `int index = -1;` variable before the loop.",
      "Inside the loop, if you find the target set `index = i;` and `break;`.",
      "Print `index` once after the loop ends.",
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        int[] nums = {10, 25, 37, 48, 59, 63};
        int target = 48;
        // Print the index of target, or -1 if not found
    }
}`,
  },
];

// ─── expectedOutput normalization ──────────────────────────────────
// Surface each problem's first example output as a top-level
// `expectedOutput` field so the Practice page's Submit checker has a
// single, canonical source of truth to compare against. Using the
// existing examples data keeps the catalog DRY — there's no chance of
// the displayed example drifting away from what the checker validates.
problems.forEach((problem) => {
  if (problem.expectedOutput === undefined) {
    const firstOutput = problem.examples?.[0]?.output ?? "";
    problem.expectedOutput = firstOutput;
  }
});

// Helper: return problems grouped by topic in a fixed order.
// Used by the Dashboard to render topic sections.
export const TOPIC_ORDER = ["Java Basics", "Conditions", "Loops", "Arrays"];

export function problemsByTopic() {
  const grouped = {};
  for (const topic of TOPIC_ORDER) {
    grouped[topic] = problems.filter((p) => p.topic === topic);
  }
  return grouped;
}

export function getProblemById(id) {
  return problems.find((p) => p.id === id) || problems[0];
}
