import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2025/day04/input.txt")) as string;

// fewer than four rolls of paper in the eight adjacent positions

// known variables

// functions
function countRollsAvailable(input: string[]): number {
  let rollsAvailable = 0;

  return rollsAvailable;
}

// part 1 logic

// part 2 logic

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("part 1 test cases", () => {
    const sampleInput = [
      "..@@.@@@@.",
      "@@@.@.@.@@",
      "@@@@@.@.@@",
      "@.@@@@..@.",
      "@@.@@@@.@@",
      ".@@@@@@@.@",
      ".@.@.@.@@@",
      "@.@@@.@@@@",
      ".@@@@@@@@.",
      "@.@.@@@.@.",
    ];
    const sampleRolls = 13;

    it("solves part 1", () => {
      const testRolls = countRollsAvailable(sampleInput);
      expect(sampleRolls).toEqual(testRolls);
    });
  });

  describe.todo("part 2 test cases", () => {
    const sampleInput = [];
    const sampleAnswers = [];

    it("", () => {});
  });
}
