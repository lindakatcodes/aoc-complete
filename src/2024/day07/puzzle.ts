import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2024/day07/input.txt")) as string;

// known variables

// functions
// from Cody: this ish breaks my brain, but this runs recursively to create all the possible combos. basically we eventually start with a single empty array, which we then turn into a result array with two inner arrays, one with a + and one with a *. then, depending how long we need it, we go back up each level and to each existing result we make a version with a + on the end and one with * on the end.
function generateOperatorCombinations(length: number): string[][] {
  if (length === 0) return [[]];
  const shorter = generateOperatorCombinations(length - 1);
  const result: string[][] = [];
  for (const combo of shorter) {
    result.push([...combo, "+"]);
    result.push([...combo, "*"]);
  }
  return result;
}

function runTest(test: string): boolean {
  let isValid = false;

  const splitTest = test.split(": ");
  const result = Number(splitTest[0]);
  const steps = splitTest[1].split(" ").map((val) => Number(val));

  const numOperators = steps.length - 1;
  const operatorCombos = generateOperatorCombinations(numOperators);

  operatorCombos.forEach((combo) => {
    let testResult = steps[0];

    for (let i = 0; i < combo.length; i++) {
      combo[i] === "+"
        ? (testResult += steps[i + 1])
        : (testResult *= steps[i + 1]);
    }

    if (testResult === result) {
      isValid = true;
    }
  });

  return isValid;
}

function runCalibrations(calList: string[], part2 = false) {
  const validTests = [];

  for (const test of calList) {
    const isValid = !part2 ? runTest(test) : runTestWithConcat(test);
    if (isValid) {
      const val = test.split(": ")[0];
      validTests.push(Number(val));
    }
  }

  return validTests;
}

// similar to before but with the 3rd operator
function generateOperatorCombinationsWithConcat(length: number): string[][] {
  if (length === 0) return [[]];
  const shorter = generateOperatorCombinationsWithConcat(length - 1);
  const result: string[][] = [];
  for (const combo of shorter) {
    result.push([...combo, "+"]);
    result.push([...combo, "*"]);
    result.push([...combo, "||"]);
  }
  return result;
}

// again similar to before but with the 3rd operator
function runTestWithConcat(test: string): boolean {
  let isValid = false;

  const splitTest = test.split(": ");
  const result = Number(splitTest[0]);
  const steps = splitTest[1].split(" ").map((val) => Number(val));

  const numOperators = steps.length - 1;
  const operatorCombos = generateOperatorCombinationsWithConcat(numOperators);

  operatorCombos.forEach((combo) => {
    let testResult = steps[0];

    for (let i = 0; i < combo.length; i++) {
      switch (combo[i]) {
        case "+":
          testResult += steps[i + 1];
          break;
        case "*":
          testResult *= steps[i + 1];
          break;
        case "||":
          testResult = Number(testResult.toString() + steps[i + 1].toString());
          break;
        default:
          break;
      }
    }

    if (testResult === result) {
      isValid = true;
    }
  });

  return isValid;
}

// part 1 logic
const calibrationResults = runCalibrations(h.splitNewLines(initData));
const calibrationSum = h.sumNumberArray(calibrationResults);
console.log({ part1: calibrationSum });

// part 2 logic
const calibrationResultsp2 = runCalibrations(h.splitNewLines(initData), true);
const calibrationSump2 = h.sumNumberArray(calibrationResultsp2);
console.log({ part2: calibrationSump2 });

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("part 1 test cases", () => {
    const sampleInput = [
      "190: 10 19",
      "3267: 81 40 27",
      "83: 17 5",
      "156: 15 6",
      "7290: 6 8 6 15",
      "161011: 16 10 13",
      "192: 17 8 14",
      "21037: 9 7 18 13",
      "292: 11 6 16 20",
    ];
    const sampleValidTestValues = [190, 3267, 292];
    const sampleSum = 3749;

    it("returns the correct test values and sum with 2 operators", () => {
      const testValues = runCalibrations(sampleInput);
      expect(testValues).toEqual(sampleValidTestValues);
      const testSum = h.sumNumberArray(testValues);
      expect(testSum).toEqual(sampleSum);
    });
  });

  describe("part 2 test cases", () => {
    const sampleInput = [
      "190: 10 19",
      "3267: 81 40 27",
      "83: 17 5",
      "156: 15 6",
      "7290: 6 8 6 15",
      "161011: 16 10 13",
      "192: 17 8 14",
      "21037: 9 7 18 13",
      "292: 11 6 16 20",
    ];

    const sampleValidTestValues = [190, 3267, 156, 7290, 192, 292];
    const sampleSum = 11387;

    it("returns the correct test values and sum with 3 operators", () => {
      const testValues = runCalibrations(sampleInput, true);
      expect(testValues).toEqual(sampleValidTestValues);
      const testSum = h.sumNumberArray(testValues);
      expect(testSum).toEqual(sampleSum);
    });
  });
}
