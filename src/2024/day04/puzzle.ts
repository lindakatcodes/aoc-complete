import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2024/day04/input.txt")) as string;

// known variables

// functions
function createSearchArray(input: string[]) {
  return input.map((row) => row.split(""));
}

function getPhraseCount(phrase: string, arr: string[][]) {
  let count = 0;

  // go line by line and find an x
  for (let i = 0; i < arr.length; i++) {
    const row = arr[i];

    for (let xi = 0; xi < row.length; xi++) {
      const letter = row[xi];

      if (letter === "X") {
        let match = false;

        // right and left are quick to get
        const right =
          xi + 4 > row.length ? row.slice(xi) : row.slice(xi, xi + 4);

        const left =
          xi - 3 < 0 ? row.slice(0, xi + 1) : row.slice(xi - 3, xi + 1);

        // the rest need the i to change in both directions, and I don't know the best way to check each one and/or cut things off early if needed so there's no out of bounds errors. need to grab that
        // upwards
        const up =
          i - 3 < 0
            ? arr[0][xi] + arr[i - 2][xi] + arr[i - 1][xi] + row[xi]
            : arr[i - 3][xi] + arr[i - 2][xi] + arr[i - 1][xi] + row[xi];

        // downwards
        const down =
          i + 3 > arr.length
            ? row[xi] + arr[i + 1][xi] + arr[i + 2][xi] + arr[i + 3][xi]
            : row[xi] + arr[xi + 3][xi] + arr[i + 2][xi] + arr[i + 1][xi];

        // diag right up

        // diag right down

        // diag left down

        // diag left up
      }
    }
  }

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
