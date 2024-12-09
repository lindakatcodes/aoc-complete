import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2024/day05/input.txt")) as string;

// known variables

// functions
function splitInstructions(input: string) {
  const roughSplit = h.splitNewLines(input);
  const rules = roughSplit
    .filter((line) => line.includes("|"))
    .map((rule) => {
      const trimmed = rule.trim();
      const [first, second] = trimmed.split("|");
      return [Number(first), Number(second)];
    });
  const updates = roughSplit
    .filter((line) => !line.includes("|") && line !== "")
    .map((update) => {
      const trimmed = update.trim();
      const updateArr = trimmed.split(",").map((val) => Number(val));
      return updateArr;
    });
  return [rules, updates];
}

function isValidUpdate(arr: number[], rules: number[][]) {
  const checks = [];

  for (let i = 0; i < arr.length; i++) {
    const val = arr[i];

    const mustGoBefore = rules
      .filter((rule) => rule[1] === val)
      .map((rule) => rule[0]);

    const mustGoAfter = rules
      .filter((rule) => rule[0] === val)
      .map((rule) => rule[1]);

    const preVal = arr.slice(0, i);
    const postVal = arr.slice(i + 1);

    if (
      mustGoAfter.every((val) => !preVal.includes(val)) &&
      mustGoBefore.every((val) => !postVal.includes(val))
    ) {
      checks.push(true);
    } else {
      checks.push(false);
    }
  }

  return checks.every((result) => result === true);
}

function validateUpdate(update: number[], rules: number[][]) {
  const sorted = [];

  for (let i = 0; i < update.length; i++) {
    if (i === 0) {
      sorted.push(update[i]);
      continue;
    } else {
      const nextVal = update[i];

      const mustGoBefore = rules
        .filter((rule) => rule[1] === nextVal)
        .map((rule) => rule[0]);

      const mustGoAfter = rules
        .filter((rule) => rule[0] === nextVal)
        .map((rule) => rule[1]);

      // from Cody: wanted to use findIndex for this but I wasn't getting the right values. so we do actually have to fully loop over the new array to find the right location
      let insertIndex = sorted.length;

      for (let j = 0; j < sorted.length; j++) {
        if (mustGoBefore.includes(sorted[j])) {
          insertIndex = j;
          break;
        }

        if (mustGoAfter.includes(sorted[j])) {
          continue;
        }
      }

      sorted.splice(insertIndex, 0, nextVal);
    }
  }

  return sorted;
}

function parseInputsForMiddles(rules: number[][], updates: number[][]) {
  const validUpdateMids: number[] = [];
  const correctedMids: number[] = [];

  updates.forEach((update) => {
    const isValid = isValidUpdate(update, rules);
    if (isValid) {
      const mid = Math.floor(update.length / 2);
      validUpdateMids.push(update[mid]);
    } else {
      const sortedUpdate = validateUpdate(update, rules);
      const sortedMid = Math.floor(sortedUpdate.length / 2);
      correctedMids.push(sortedUpdate[sortedMid]);
    }
  });

  return [validUpdateMids, correctedMids];
}

// part 1 logic
const [fullRules, fullUpdates] = splitInstructions(initData);
const [correctMiddles, fixedMiddles] = parseInputsForMiddles(
  fullRules,
  fullUpdates
);
const middleSum = h.sumNumberArray(correctMiddles);
console.log({ part1: middleSum });

// part 2 logic
const fixedSum = h.sumNumberArray(fixedMiddles);
console.log({ part2: fixedSum });

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  const sampleInput = `47|53
      97|13
      97|61
      97|47
      75|29
      61|13
      75|53
      29|13
      97|29
      53|29
      61|53
      97|53
      61|29
      47|13
      75|47
      97|75
      47|61
      75|61
      47|29
      75|13
      53|13

      75,47,61,53,29
      97,61,53,29,13
      75,29,13
      75,97,47,61,53
      61,13,29
      97,13,75,29,47`;

  const sampleRules = [
    [47, 53],
    [97, 13],
    [97, 61],
    [97, 47],
    [75, 29],
    [61, 13],
    [75, 53],
    [29, 13],
    [97, 29],
    [53, 29],
    [61, 53],
    [97, 53],
    [61, 29],
    [47, 13],
    [75, 47],
    [97, 75],
    [47, 61],
    [75, 61],
    [47, 29],
    [75, 13],
    [53, 13],
  ];

  const sampleUpdates = [
    [75, 47, 61, 53, 29],
    [97, 61, 53, 29, 13],
    [75, 29, 13],
    [75, 97, 47, 61, 53],
    [61, 13, 29],
    [97, 13, 75, 29, 47],
  ];

  describe("part 1 test cases", () => {
    const sampleCorrectUpdateMiddles = [61, 53, 29];
    const sampleSum = 143;

    it("properly splits the input into rules and updates", () => {
      const [testRules, testUpdates] = splitInstructions(sampleInput);
      expect(testRules).toEqual(sampleRules);
      expect(testUpdates).toEqual(sampleUpdates);
    });

    it("finds the correct updates and calculates the correct middle sum", () => {
      const [testMiddles, _] = parseInputsForMiddles(
        sampleRules,
        sampleUpdates
      );
      expect(testMiddles).toEqual(sampleCorrectUpdateMiddles);
      const testSum = h.sumNumberArray(testMiddles);
      expect(testSum).toEqual(sampleSum);
    });
  });

  describe("part 2 test cases", () => {
    const sampleFixedUpdateMiddles = [47, 29, 47];
    const sampleFixedSum = 123;

    it("finds the invalid updates, corrects them, and calculates the correct middle sum", () => {
      const [_, testMiddles] = parseInputsForMiddles(
        sampleRules,
        sampleUpdates
      );
      expect(testMiddles).toEqual(sampleFixedUpdateMiddles);
      const testSum = h.sumNumberArray(testMiddles);
      expect(testSum).toEqual(sampleFixedSum);
    });
  });
}
