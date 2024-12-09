import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2024/day04/input.txt")) as string;

// known variables
// from Cody: from any location, this gives us the most basic change in our coord if we move that direction. once we multiply this value by whatever step we're on, it will then change by that much to keep us moving and let us build the whole string
const directions = [
  [0, 1],   // right
  [0, -1],  // left
  [-1, 0],  // up
  [1, 0],   // down
  [-1, 1],  // diagonal right up
  [1, 1],   // diagonal right down
  [-1, -1], // diagonal left up
  [1, -1]   // diagonal left down
];

// for the second part, we only want to check diagonals (since the other shapes are actually plus signs not x's)
const onlyDiagonals = [
  [-1, 1],  // diagonal right up
  [1, 1],   // diagonal right down
  [-1, -1], // diagonal left up
  [1, -1]   // diagonal left down
]

// functions
function createSearchArray(input: string[]) {
  return input.map((row) => row.split(""));
}

// from Cody: makes sure a given row and col number are within bounds of the grid
function isInBounds(row: number, col: number, grid: string[][]): boolean {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
}

/* 
  from Cody: takes all the pertinent values and tries to build the desired phrase, as long as the values are in bounds
  startRow and startCol: the location of the X we're checking against
  rowDelta and colDelta: the amount we're moving in a given direction
  length: how long the phrase we're trying to build is
  grid: our initial grid, so we can actually build the string if the location is valid
*/
function buildDirectionalString(
  startRow: number,
  startCol: number,
  rowDelta: number,
  colDelta: number,
  length: number,
  grid: string[][]
): string | null {
  let result = "";

  for (let step = 0; step < length; step++) {
    const currentRow = startRow + rowDelta * step;
    const currentCol = startCol + colDelta * step;

    if (!isInBounds(currentRow, currentCol, grid)) {
      return null;
    }
    result += grid[currentRow][currentCol];
  }

  return result;
}

function getPhraseCount(phrase: string, arr: string[][]) {
  let count = 0;

  // go line by line and find an x
  for (let i = 0; i < arr.length; i++) {
    const row = arr[i];

    for (let xi = 0; xi < row.length; xi++) {
      const letter = row[xi];

      if (letter === "X") {
        for (const [rowDelta, colDelta] of directions) {
          const str = buildDirectionalString(
            i,
            xi,
            rowDelta,
            colDelta,
            phrase.length,
            arr
          );
          if (str === phrase) {
            count++;
          }
        }
      }
    }
  }
  return count;
}

// from Cody: slightly simplifies the logic to only check diagonals and we also need to check one letter before and one after only since we're starting from the middle and the phrase is shorter
function findMASPatterns(row: number, col: number, grid: string[][]): number {
  let patternCount = 0;
  
  for (const [rowDelta, colDelta] of onlyDiagonals) {
    // Check for M (one step backwards)
    const prevRow = row - rowDelta;
    const prevCol = col - colDelta;
    // Check for S (one step forwards)
    const nextRow = row + rowDelta;
    const nextCol = col + colDelta;
    
    if (isInBounds(prevRow, prevCol, grid) && 
        isInBounds(nextRow, nextCol, grid) && 
        grid[prevRow][prevCol] === 'M' && 
        grid[nextRow][nextCol] === 'S') {
      patternCount++;
    }
  }
  
  return patternCount;
}

function getCrossedPhraseCount(arr: string[][]) {
  let count = 0;

  // now looking for A since that's the part that crosses both strings
  for (let i = 0; i < arr.length; i++) {
    const row = arr[i];

    for (let xi = 0; xi < row.length; xi++) {
      const letter = row[xi];

      if (letter === "A") {
        const matches = findMASPatterns(i, xi, arr);
        if (matches >= 2) {
          count++;
        }
      }
    }
  }
  return count;
}

// part 1 logic
const xmasGrid = createSearchArray(h.splitNewLines(initData));
const xmasCount = getPhraseCount("XMAS", xmasGrid);
console.log({ part1: xmasCount });

// part 2 logic
const masCount = getCrossedPhraseCount(xmasGrid);
console.log({part2: masCount })

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

  describe("part 2 test cases", () => {
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
    const sampleCount = 9;

    it("finds the right amount of crossings of the sample phrase", () => {
      const testSearch = createSearchArray(sampleInput);
      const testCount = getCrossedPhraseCount(testSearch);
      expect(testCount).toEqual(sampleCount);
    });
  });
}
