function normalizeProgram(parsedRepresentation) {
  if (!parsedRepresentation) return { type: "Program", body: [] };
  if (parsedRepresentation.type === "Program" && Array.isArray(parsedRepresentation.body)) {
    return parsedRepresentation;
  }
  if (Array.isArray(parsedRepresentation.body)) {
    return { type: "Program", body: parsedRepresentation.body };
  }
  return { type: "Program", body: [] };
}

function createMemoryState() {
  return {
    stack: [],
    heap: [],
  };
}

function cloneMemory(memory) {
  return {
    stack: memory.stack.map((item) => ({ ...item })),
    heap: memory.heap.map((item) => ({ ...item })),
  };
}

function expressionHasCall(expr) {
  if (!expr || typeof expr !== "object") return false;
  if (expr.type === "CallExpression") return true;

  for (const key of Object.keys(expr)) {
    const value = expr[key];
    if (Array.isArray(value)) {
      if (value.some((child) => expressionHasCall(child))) return true;
    } else if (value && typeof value === "object") {
      if (expressionHasCall(value)) return true;
    }
  }

  return false;
}

function collectCalls(node, calls = []) {
  if (!node || typeof node !== "object") return calls;
  if (node.type === "CallExpression") {
    const calleeName = node.callee?.name || node.name || "function";
    calls.push({ name: calleeName, lineNumber: node.lineNumber || null });
  }

  for (const key of Object.keys(node)) {
    const value = node[key];
    if (Array.isArray(value)) {
      value.forEach((child) => collectCalls(child, calls));
    } else if (value && typeof value === "object") {
      collectCalls(value, calls);
    }
  }

  return calls;
}

function inferArrayContribution(valueNode) {
  if (!valueNode || valueNode.type !== "ArrayExpression") return null;

  const elements = valueNode.elements || [];
  const hasNestedArray = elements.some((el) => el?.type === "ArrayExpression");
  if (hasNestedArray) return "n^2";
  return "n";
}

function contributionRank(term) {
  if (term === "n^2") return 4;
  if (term === "n") return 3;
  if (term === "stack") return 2;
  return 1;
}

function dominantContribution(contributions) {
  if (!contributions.length) return "1";
  return contributions.reduce((best, current) =>
    contributionRank(current) > contributionRank(best) ? current : best,
  "1");
}

function contributionToBigO(contribution) {
  if (contribution === "stack") return "O(n)";
  if (contribution === "n^2") return "O(n^2)";
  if (contribution === "n") return "O(n)";
  return "O(1)";
}

function toBigOFromContribution(contribution) {
  if (contribution === "n^2") return "O(n^2)";
  if (contribution === "n") return "O(n)";
  if (contribution === "stack") return "O(n)";
  return "O(1)";
}

function combineTerms(terms = []) {
  if (!terms.length) return "O(1)";
  return terms.join(" + ");
}

function createStepFactory(steps, memory) {
  let stepId = 1;

  return function emitStep({ lineNumber, event, narration, bubble, complexityContribution = "1", title }) {
    const step = {
      stepId,
      order: stepId,
      lineNumber: lineNumber || null,
      event,
      title: title || narration,
      description: narration,
      narration,
      bubble,
      memory: cloneMemory(memory),
      complexityContribution,
      animation: {
        type: "highlight_line",
        duration: 500,
      },
    };

    steps.push(step);
    stepId += 1;
    return step;
  };
}

function processStatement(node, context) {
  if (!node || typeof node !== "object") return;
  const { emitStep, memory, contributions, currentFunction, contributionBuckets } = context;

  if (node.type === "VariableDeclaration") {
    const arrayContribution = inferArrayContribution(node.value);

    if (arrayContribution === "n^2") {
      memory.heap.push({ name: node.name, shape: "2d-array", size: "n^2" });
      contributions.push("n^2");
      contributionBuckets.arrays2d += 1;
      emitStep({
        lineNumber: node.lineNumber,
        event: "space_array_2d",
        narration: "We create a 2D array.",
        bubble: "We create a 2D array.\nSpace grows with n^2.",
        complexityContribution: "n^2",
      });
      return;
    }

    if (arrayContribution === "n") {
      memory.heap.push({ name: node.name, shape: "array", size: "n" });
      contributions.push("n");
      contributionBuckets.arrays += 1;
      emitStep({
        lineNumber: node.lineNumber,
        event: "space_array",
        narration: "We create an array.",
        bubble: "We create an array.\nSpace grows with n.",
        complexityContribution: "n",
      });
      return;
    }

    memory.stack.push({ name: node.name, value: "value" });
    contributions.push("1");
    contributionBuckets.variables += 1;
    emitStep({
      lineNumber: node.lineNumber,
      event: "space_variable",
      narration: "We create a variable.",
      bubble: "We create a variable.\nTakes constant space.",
      complexityContribution: "1",
    });
    return;
  }

  if (node.type === "FunctionDeclaration") {
    const selfCalls = collectCalls(node.body || []).filter((call) => call.name === node.name);
    if (selfCalls.length > 0) {
      contributions.push("stack");
      contributionBuckets.recursion += selfCalls.length;
      emitStep({
        lineNumber: node.lineNumber,
        event: "space_recursion",
        narration: "This function calls itself.",
        bubble: "Recursive calls\nadd to the stack.",
        complexityContribution: "stack",
      });
    }

    const nestedContext = { ...context, currentFunction: node.name };
    (node.body || []).forEach((child) => processStatement(child, nestedContext));
    return;
  }

  if (node.type === "WhileStatement" || node.type === "ForStatement") {
    emitStep({
      lineNumber: node.lineNumber,
      event: "space_loop",
      narration: "The loop repeats using the same variables.",
      bubble: "Loop runs again,\nbut space stays about the same.",
      complexityContribution: "1",
    });

    (node.body || []).forEach((child) => processStatement(child, context));
    return;
  }

  if (node.type === "ExpressionStatement" && expressionHasCall(node.expression)) {
    const calls = collectCalls(node.expression);
    calls.forEach((call) => {
      const isRecursiveCall = currentFunction && call.name === currentFunction;
      const contribution = isRecursiveCall ? "stack" : "1";
      contributions.push(contribution);
      if (isRecursiveCall) {
        contributionBuckets.recursion += 1;
      } else {
        contributionBuckets.functionCalls += 1;
      }
      memory.stack.push({ name: `${call.name}()`, value: "frame" });

      emitStep({
        lineNumber: call.lineNumber || node.lineNumber,
        event: isRecursiveCall ? "space_recursive_call" : "space_function_call",
        narration: isRecursiveCall
          ? "The function calls itself again."
          : "We call another function.",
        bubble: isRecursiveCall
          ? "Recursive calls\nadd to the stack."
          : "Function call adds\none stack frame.",
        complexityContribution: contribution,
      });

      memory.stack.pop();
    });
    return;
  }

  if (node.type === "Assignment" || node.type === "ReturnStatement" || node.type === "IfStatement") {
    contributions.push("1");
    emitStep({
      lineNumber: node.lineNumber,
      event: "space_step",
      narration: "This step reuses existing memory.",
      bubble: "No big extra space\nis added here.",
      complexityContribution: "1",
    });

    if (node.type === "IfStatement") {
      (node.consequent || []).forEach((child) => processStatement(child, context));
      (node.alternate || []).forEach((child) => processStatement(child, context));
    }
  }
}

function buildSpaceComplexityTimeline(parsedRepresentation) {
  const program = normalizeProgram(parsedRepresentation);
  const steps = [];
  const memory = createMemoryState();
  const contributions = [];
  const contributionBuckets = {
    variables: 0,
    arrays: 0,
    arrays2d: 0,
    recursion: 0,
    functionCalls: 0,
  };
  const emitStep = createStepFactory(steps, memory);

  (program.body || []).forEach((node) =>
    processStatement(node, {
      emitStep,
      memory,
      contributions,
      contributionBuckets,
      currentFunction: null,
    }),
  );

  const dominant = dominantContribution(contributions);
  const finalComplexity = contributionToBigO(dominant);

  const contributionItems = [];
  if (contributionBuckets.variables > 0) {
    contributionItems.push({
      key: "variables",
      label: "variables",
      complexity: "O(1)",
      explanation: "Variables use constant space.",
    });
  }
  if (contributionBuckets.arrays > 0) {
    contributionItems.push({
      key: "arrays",
      label: "arrays",
      complexity: "O(n)",
      explanation: "Arrays grow with input size.",
    });
  }
  if (contributionBuckets.arrays2d > 0) {
    contributionItems.push({
      key: "arrays2d",
      label: "2D arrays",
      complexity: "O(n^2)",
      explanation: "2D arrays grow like n by n.",
    });
  }
  if (contributionBuckets.recursion > 0) {
    contributionItems.push({
      key: "recursion",
      label: "recursive calls",
      complexity: "O(n)",
      explanation: "Recursive calls add stack layers.",
    });
  }
  if (contributionBuckets.functionCalls > 0) {
    contributionItems.push({
      key: "functionCalls",
      label: "function calls",
      complexity: "O(1)",
      explanation: "Each call adds one stack frame.",
    });
  }

  const contributionTerms = contributionItems.map((item) => item.complexity);
  const combinedExpression = combineTerms(contributionTerms);
  const focusLine = steps.find((step) => step.lineNumber)?.lineNumber || 1;

  emitStep({
    lineNumber: focusLine,
    event: "space_highlight_contributions",
    narration: "We highlight all memory contributions.",
    bubble: "Variables -> constant. Arrays -> n.",
    complexityContribution: dominant,
    title: "Highlight memory contributions",
  });

  emitStep({
    lineNumber: focusLine,
    event: "space_combine_contributions",
    narration: "Now we combine them.",
    bubble: combinedExpression,
    complexityContribution: dominant,
    title: "Combine terms",
  });

  emitStep({
    lineNumber: focusLine,
    event: "space_simplify_contributions",
    narration: "Now we keep the biggest term.",
    bubble: finalComplexity,
    complexityContribution: dominant,
    title: "Simplify",
  });

  emitStep({
    lineNumber: focusLine,
    event: "space_summary",
    narration: "This is the overall memory growth.",
    bubble:
      finalComplexity === "O(n)" && contributionBuckets.arrays > 0
        ? "Overall Space Complexity: O(n)\nBecause the array grows with input size."
        : `Overall Space Complexity: ${finalComplexity}\nThis is the final answer for space usage.`,
    complexityContribution: dominant,
    title: "Final space answer",
  });

  const byId = new Map(steps.map((step) => [step.stepId, step]));

  return {
    steps,
    finalComplexity,
    metadata: {
      totalSteps: steps.length,
      dominantTerm: dominant,
      eventCount: steps.length,
      contributionItems,
      combinedExpression,
    },
    getNextStep(currentId) {
      const sorted = [...steps].sort((a, b) => a.stepId - b.stepId);
      if (currentId == null) return sorted[0] || null;
      const index = sorted.findIndex((step) => step.stepId === currentId);
      if (index < 0 || index >= sorted.length - 1) return null;
      return sorted[index + 1];
    },
    getPreviousStep(currentId) {
      const sorted = [...steps].sort((a, b) => a.stepId - b.stepId);
      if (currentId == null) return null;
      const index = sorted.findIndex((step) => step.stepId === currentId);
      if (index <= 0) return null;
      return sorted[index - 1];
    },
    getStepById(id) {
      return byId.get(id) || null;
    },
  };
}

function getSpaceLineExplanation({ lineNumber, event }) {
  if (event?.bubble) return event.bubble;
  if (!lineNumber) return "Press Play and follow the highlighted line.";

  if (lineNumber === 2) return "We create one number variable. That uses only a tiny fixed amount of memory.";
  if (lineNumber === 3) return "We create one result variable. It also stays constant space.";
  if (lineNumber === 4) return "The loop repeats, but it reuses the same memory each time.";
  if (lineNumber === 5) return "We update one value. No growing array or extra storage is created.";
  if (lineNumber === 6) return "Printing a value does not keep extra memory around.";
  if (lineNumber === 7) return "We update the same variable again. Space still stays constant.";
  if (lineNumber === 9) return "Final answer: O(1) space, because the program only keeps a few variables.";

  return "This line uses\nconstant extra space.";
}

export { buildSpaceComplexityTimeline, getSpaceLineExplanation };
