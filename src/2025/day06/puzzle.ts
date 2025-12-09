import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2025/day06/input.txt")) as string;

// known variables
const homeworkRows = h.splitNewLines(initData);

// functions
function solveProblemsOne(input: string[]): number[] {
  const solutions: number[] = [];
  const spacesRegex = /\s+/;

  const problemRows = input.slice(0, input.length - 1).map((row) => {
    return row.split(spacesRegex).filter((val) => val !== "");
  });

  const mathType = input[input.length - 1]
    .split(spacesRegex)
    .filter((val) => val !== "");

  for (let i = 0; i < problemRows[0].length; i++) {
    const numbers = problemRows.map((row) => row[i]).map((val) => Number(val));
    const sign = mathType[i];

    const total = numbers.reduce((first, second) => {
      return sign === "+" ? first + second : first * second;
    });

    solutions.push(total);
  }

  return solutions;
}

function solveProblemsTwo(input: string[]): number[] {
  const solutions: number[] = [];
  const spacesRegex = /\s+/;

  // same as before, except we're reversing it since we're reading right to left now
  const mathType = input[input.length - 1]
    .split(spacesRegex)
    .filter((val) => val !== "")
    .reverse();

  const numbers = input.slice(0, input.length - 1);

  // parse the numbers into sets of values, then once we reach a full empty string we add those values to our problem set and reset values for the next problem - this will give us all the column numbers reading from right to left
  const problems: number[][] = [];
  let values: number[] = [];

  for (let i = input[0].length - 1; i >= 0; i--) {
    const strVal = numbers.map((row) => row.charAt(i)).join("");

    if (strVal.trim() !== "") {
      const numVal = Number(strVal);
      values.push(numVal);
    } else {
      problems.push(values);
      values = [];
    }
  }

  // need to push the last values array onto problems, since there won't be an empty string at the start
  problems.push(values);

  // then we can do the same as before where we reduce the problems down with their proper sign and add the result to our solutions array
  problems.forEach((problem, index) => {
    const sign = mathType[index];

    const total = problem.reduce((first, second) => {
      return sign === "+" ? first + second : first * second;
    });

    solutions.push(total);
  });

  return solutions;
}

function calcTotal(numArr: number[]): number {
  return h.sumNumberArray(numArr);
}

// part 1 logic
const oneTotals = solveProblemsOne(homeworkRows);
const oneSum = calcTotal(oneTotals);
console.log(`part 1: ${oneSum}`);

// part 2 logic
const twoTotals = solveProblemsTwo(homeworkRows);
const twoSum = calcTotal(twoTotals);
console.log(`part 2: ${twoSum}`);

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("part 1 test cases", () => {
    const sampleInput = [
      "123 328  51 64 ",
      " 45 64  387 23 ",
      "  6 98  215 314",
      "*   +   *   +  ",
    ];
    const sampleResults = [33210, 490, 4243455, 401];
    const sampleGrandTotal = 4277556;

    it("solves part 1", () => {
      const testResults = solveProblemsOne(sampleInput);
      expect(testResults).toEqual(sampleResults);
      const testSum = calcTotal(testResults);
      expect(testSum).toEqual(sampleGrandTotal);
    });
  });

  describe("part 2 test cases", () => {
    const sampleInput = [
      "123 328  51 64 ",
      " 45 64  387 23 ",
      "  6 98  215 314",
      "*   +   *   +  ",
    ];
    const sampleResults = [1058, 3253600, 625, 8544];
    const sampleGrandTotal = 3263827;
    it("solves part 2", () => {
      const testResults = solveProblemsTwo(sampleInput);
      expect(testResults).toEqual(sampleResults);
      const testSum = calcTotal(testResults);
      expect(testSum).toEqual(sampleGrandTotal);
    });
  });
}
