import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2025/day04/input.txt")) as string;

// known variables
const diagram = h.splitNewLines(initData);

interface GridItem {
  status: "." | "x" | "@";
  count: number;
  neighbors: Array<string>;
}

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

function processGrid(input: string[]): Map<string, GridItem> {
  const grid = new Map();

  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[0].length; col++) {
      const key = `${row},${col}`;
      const status = input[row][col];
      const neighbors: string[] = [];

      // this builds out the neighbors array, only storing ones that actually exist
      if (row - 1 >= 0 && col - 1 >= 0) {
        neighbors.push(`${row - 1},${col - 1}`);
      }
      if (row - 1 >= 0 && col >= 0) {
        neighbors.push(`${row - 1},${col}`);
      }
      if (row - 1 >= 0 && col + 1 < input[0].length) {
        neighbors.push(`${row - 1},${col + 1}`);
      }
      if (col - 1 >= 0) {
        neighbors.push(`${row},${col - 1}`);
      }
      if (col + 1 < input[0].length) {
        neighbors.push(`${row},${col + 1}`);
      }
      if (row + 1 < input.length && col - 1 >= 0) {
        neighbors.push(`${row + 1},${col - 1}`);
      }
      if (row + 1 < input.length && col >= 0) {
        neighbors.push(`${row + 1},${col}`);
      }
      if (row + 1 < input.length && col + 1 < input[0].length) {
        neighbors.push(`${row + 1},${col + 1}`);
      }

      // this gets us our count
      let count = 0;
      neighbors.forEach((spot) => {
        const spotCoords = spot.split(",");
        const spotVal = input[spotCoords[0]][spotCoords[1]];
        if (spotVal === "@") {
          count++;
        }
      });

      grid.set(key, {
        status,
        neighbors,
        count,
      });
    }
  }

  return grid;
}

function findAllRolls(input: string[]): number {
  let totalCount = 0;
  const rollsToRemove: string[] = [];

  // first we make an obj array to hold our initial grid state; each object has the coords as the key, then will store the current node's count, it's status (., x, @), and an array of neighbor positions
  const gridState = processGrid(input);

  // next we go through our grid and find any rolls that can be removed, and add those keys to the array to be processed - this is off of our initial grid so we run it directly first to populate the first  round of rolls to remove
  gridState.forEach((gridItem, gridKey) => {
    if (gridItem.status === "@" && gridItem.count < 4) {
      rollsToRemove.push(gridKey);
    }
  });

  // then when we process the to check array, we'll change that obj's status, increase our overall counter by 1, and grab it's neighbor list; we'll need to decrease the count for each neighbor by 1, and if it's now going to be < 3 we add it to the to check array
  // repeat until there's no more nodes to check and return the final count
  while (rollsToRemove.length > 0) {
    const workNode = rollsToRemove.shift()!;
    const toUpdate = gridState.get(workNode)!;
    totalCount++;
    toUpdate.status = "x";
    for (let i = 0; i < toUpdate.neighbors.length; i++) {
      const neighborKey = toUpdate.neighbors[i];
      const neighborItem = gridState.get(neighborKey)!;
      neighborItem.count--;
      // also important to make sure the neighbor isn't already in the to check list; we don't want to process it more than it needs to be
      const alreadyInList = rollsToRemove.find((roll) => roll === neighborKey);
      if (
        neighborItem.status === "@" &&
        neighborItem.count < 4 &&
        !alreadyInList
      ) {
        rollsToRemove.push(neighborKey);
      }
    }
  }

  return totalCount;
}

// part 1 logic
const availableRollsOne = countRollsAvailable(diagram);
console.log("part 1: ", availableRollsOne);

// part 2 logic
const availableRollsTwo = findAllRolls(diagram);
console.log("part 2: ", availableRollsTwo);

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
