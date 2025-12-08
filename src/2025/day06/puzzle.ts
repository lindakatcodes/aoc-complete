import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2025/day06/input.txt")) as string;

// known variables

// functions
function solveProblems(string[]): number[] {
  const solutions: number[] = [];

  const 
}

function calcTotal(numArr: number[]): number {
  return h.sumNumberArray(numArr);
}

// part 1 logic

// part 2 logic

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
      const testResults = solveProblems(sampleInput);
      expect(testResults).toEqual(sampleResults);
      const testSum = calcTotal(testResults);
      expect(testSum).toEqual(sampleGrandTotal);
    });
  });

  describe.todo("part 2 test cases", () => {
    const sampleInput = [];
    const sampleAnswers = [];

    it("", () => {});
  });
}
