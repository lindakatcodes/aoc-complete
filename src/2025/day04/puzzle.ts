import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2025/day04/input.txt")) as string;

// fewer than four rolls of paper in the eight adjacent positions

// known variables
const diagram = h.splitNewLines(initData);

// functions
function countRollsAvailable(input: string[]): number {
  let rollsAvailable = 0;

  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[0].length; col++) {
      if (input[row][col] === ".") continue;

      const nw = input[row - 1]?.[col - 1] ?? ".";
      const n = input[row - 1]?.[col] ?? ".";
      const ne = input[row - 1]?.[col + 1] ?? ".";
      const w = input[row][col - 1] ?? ".";
      const e = input[row][col + 1] ?? ".";
      const sw = input[row + 1]?.[col - 1] ?? ".";
      const s = input[row + 1]?.[col] ?? ".";
      const se = input[row + 1]?.[col + 1] ?? ".";

      let count = 0;
      const positions = [nw, n, ne, w, e, sw, s, se];
      positions.forEach((spot) => {
        if (spot === "@") {
          count++;
        }
      });
      if (count < 4) {
        rollsAvailable++;
      }
    }
  }

  return rollsAvailable;
}

function initProcessRolls(input: string[]): [string[][], number[][]] {
  const rollCounts: string[][] = [];
  const rollsToRemove: number[][] = [];

  for (let row = 0; row < input.length; row++) {
    const currRow: string[] = [];

    for (let col = 0; col < input[0].length; col++) {
      const curr = input[row][col];
      if (curr === ".") {
        currRow.push(curr);
        continue;
      }

      const nw = input[row - 1]?.[col - 1] ?? ".";
      const n = input[row - 1]?.[col] ?? ".";
      const ne = input[row - 1]?.[col + 1] ?? ".";
      const w = input[row][col - 1] ?? ".";
      const e = input[row][col + 1] ?? ".";
      const sw = input[row + 1]?.[col - 1] ?? ".";
      const s = input[row + 1]?.[col] ?? ".";
      const se = input[row + 1]?.[col + 1] ?? ".";

      let count = 0;
      const positions = [nw, n, ne, w, e, sw, s, se];
      positions.forEach((spot) => {
        if (spot === "@") {
          count++;
        }
      });
      currRow.push(count.toString());
      if (count < 4) {
        rollsToRemove.push([row, col]);
      }
    }
    console.log({ currRow });
    rollCounts.push(currRow);
  }

  console.log({ rollCounts, rollsToRemove });

  return [rollCounts, rollsToRemove];
}

function processNeighborRolls(
  countDiagram: string[][],
  roll: number[]
): string[][] {
  // somehow in here, need to check each of the neighbors for the given roll, reduce the count by 1 if it's a roll or leave it alone if not, and set the roll position to be 'x' so it's not counted anymore.
  // then return the updated diagram with the new counts and roll removed
}

function findAllRolls(input: string[]): number {
  let [countDiagram, rollsToRemove] = initProcessRolls(input);
  let totalRolls = 0;

  while (rollsToRemove.length > 0) {
    //  You'd need a way to keep track of the current neighbor count for every roll and a queue of rolls that are ready to be removed. When you process a roll from the queue, you update its neighbors, and if any of them become removable, you add them to the queue.
    const currRoll = rollsToRemove.shift()!;
    totalRolls++;
    countDiagram = processNeighborRolls(countDiagram, currRoll);
  }
}

// part 1 logic
const availableRollsOne = countRollsAvailable(diagram);
console.log(`part 1: `, availableRollsOne);

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
      expect(testRolls).toEqual(sampleRolls);
    });
  });

  describe("part 2 test cases", () => {
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
    const sampleRolls = 43;

    it("solves part 2", () => {
      const testRolls = findAllRolls(sampleInput);
      expect(testRolls).toEqual(sampleRolls);
    });
  });
}
