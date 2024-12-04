import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2024/day04/input.txt")) as string;

// known variables

// functions
function createSearchArray(input: string[]) {
  return input.map((row) => row.split(""));
}

function getPhraseCount(phrase: string, searchArr: string[][]) {
  let count = 0;

  // go line by line and find an x
  for (let i = 0; i < searchArr.length; i++) {}

  // when an x is found, check each possible direction to see if the letters are as expected. potentially just assemble a string to compare for each one, and early exit if it goes out of bounds?

  // the second it's not, cancel out and move on. otherwise, if we find the whole word, add it to the count
}

// part 1 logic

// part 2 logic

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("part 1 test cases", () => {
    const sampleInput = [
      "MMMSXXMASM",
      "MSAMXMSMSA",
      "AMXSXMAAMM",
      "MSAMASMSMX",
      "XMASAMXAMM",
      "XXAMMXXAMA",
      "SMSMSASXSS",
      "SAXAMASAAA",
      "MAMMMXMMMM",
      "MXMXAXMASX",
    ];
    const sampleCount = 18;
    const samplePhrase = "XMAS";

    it("finds the right amount of the sample phrase", () => {
      const testSearch = createSearchArray(sampleInput);
      const testCount = getPhraseCount(samplePhrase, testSearch);
      expect(testCount).toEqual(sampleCount);
    });
  });

  describe.todo("part 2 test cases", () => {
    const sampleInput = [];
    const sampleAnswers = [];

    it("", () => {});
  });
}
