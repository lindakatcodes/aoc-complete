import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2024/day06/input.txt")) as string;

// known variables

// functions
function isInBounds(row: number, col: number, maxRow: number, maxCol: number) {
  const rowInBounds = row >= 0 && row < maxRow;
  const colInBounds = col >= 0 && col < maxCol;
  return rowInBounds && colInBounds;
}

function rotateDir(dir: string) {
  switch (dir) {
    case "up":
      return "right";
    case "down":
      return "left";
    case "right":
      return "down";
    case "left":
      return "up";
    default:
      return "up";
  }
}

function plotPatrol(map: string[]) {
  const splitMap = map.map((row) => row.split(""));
  // map boundaries
  const maxRow = map.length;
  const maxCol = splitMap[0].length;

  // where's the guard start?
  const guardStartRow = map.findIndex((row) => row.includes("^"));
  const guardStartCol = splitMap[guardStartRow].findIndex(
    (char) => char === "^"
  );

  let dir = "up";
  let [guardRow, guardCol] = [guardStartRow, guardStartCol];

  // from Cody: we need to track locations we've visited so we can detect when we hit a loop
  const visited = new Set<string>();
  let foundLoop = false;

  while (isInBounds(guardRow, guardCol, maxRow, maxCol)) {
    // from Cody: we're making a unique state key with our location and direction. if we've already visited this way we're in a loop and can exit. otherwise keep going
    const stateKey = `${guardRow},${guardCol},${dir}`;
    if (visited.has(stateKey)) {
      foundLoop = true;
      break;
    }

    // mark the current spot as visited
    visited.add(stateKey);
    splitMap[guardRow][guardCol] = "X";

    // check next location - can we move there?
    let nextRow = 0;
    let nextCol = 0;
    switch (dir) {
      case "up":
        nextRow = guardRow - 1;
        nextCol = guardCol;
        break;
      case "down":
        nextRow = guardRow + 1;
        nextCol = guardCol;
        break;
      case "right":
        nextRow = guardRow;
        nextCol = guardCol + 1;
        break;
      case "left":
        nextRow = guardRow;
        nextCol = guardCol - 1;
        break;
      default:
        nextRow = guardRow;
        nextCol = guardCol;
        break;
    }

    // if the next move will take us out of bounds, we're done and can exit
    if (!isInBounds(nextRow, nextCol, maxRow, maxCol)) {
      break;
    }
    // otherwise we need to check for an obstruction
    const canMove = splitMap[nextRow][nextCol] !== "#";

    // if we can move, change coords - otherwise change dir
    if (canMove) {
      guardRow = nextRow;
      guardCol = nextCol;
    } else {
      dir = rotateDir(dir);
    }
  }

  // return our completed patrol map in the same format as our original
  const finalMap = splitMap.map((row) => row.join(""));
  return { path: finalMap, foundLoop };
}

function countLocations(map: string[]) {
  let visitedCount = 0;

  for (let i = 0; i < map.length; i++) {
    const row = map[i];
    const rowVistedMarks = row.split("").filter((spot) => spot === "X").length;
    visitedCount += rowVistedMarks;
  }

  return visitedCount;
}

// from Cody: couldn't think of how to check for all the possible obstructions so got help. Interesting idea to specifically just check for spots on the original patrol for the new obstruction, cuts down our time and makes sense
function findPossibleObstructions(map: string[]): string[] {
  const originalPath = plotPatrol(map);
  const possibleSpots: string[] = [];

  const mapArray = map.map((row) => row.split(""));
  const rows = mapArray.length;
  const cols = mapArray[0].length;

  // Find guard start position
  const startRow = map.findIndex((row) => row.includes("^"));
  const startCol = mapArray[startRow].indexOf("^");

  // Try placing an obstruction at each visited position
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Skip if:
      // - Current position is guard start
      // - Current position is existing obstacle
      // - Current position wasn't visited in original path
      if (
        (r === startRow && c === startCol) ||
        mapArray[r][c] === "#" ||
        originalPath.path[r][c] !== "X"
      ) {
        continue;
      }

      // Create test map with new obstruction
      const testMap = map.map((row) => row.split(""));
      testMap[r][c] = "#";
      const testMapStr = testMap.map((row) => row.join(""));

      // Run patrol with new obstruction
      const newPath = plotPatrol(testMapStr);

      // Check if this creates a loop (visited count is less than original)
      if (newPath.foundLoop) {
        possibleSpots.push(`${r},${c}`);
      }
    }
  }

  return possibleSpots;
}

// part 1 logic
const guardPatrolMap = plotPatrol(h.splitNewLines(initData));
const guardSpots = countLocations(guardPatrolMap.path);
console.log({ part1: guardSpots });

// part 2 logic
const possibleObstructions = findPossibleObstructions(
  h.splitNewLines(initData)
);
console.log({ part2: possibleObstructions.length });

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("part 1 test cases", () => {
    const sampleStartMap = [
      "....#.....",
      ".........#",
      "..........",
      "..#.......",
      ".......#..",
      "..........",
      ".#..^.....",
      "........#.",
      "#.........",
      "......#...",
    ];
    const sampleEndMap = [
      "....#.....",
      "....XXXXX#",
      "....X...X.",
      "..#.X...X.",
      "..XXXXX#X.",
      "..X.X.X.X.",
      ".#XXXXXXX.",
      ".XXXXXXX#.",
      "#XXXXXXX..",
      "......#X..",
    ];
    const sampleUniqueLocations = 41;

    it("moves the guard through the map and counts the right number of unique visits", () => {
      const testPatrolRoute = plotPatrol(sampleStartMap);
      expect(testPatrolRoute.path).toEqual(sampleEndMap);
      const testLocations = countLocations(testPatrolRoute.path);
      expect(testLocations).toEqual(sampleUniqueLocations);
    });
  });

  describe("part 2 test cases", () => {
    const sampleStartMap = [
      "....#.....",
      ".........#",
      "..........",
      "..#.......",
      ".......#..",
      "..........",
      ".#..^.....",
      "........#.",
      "#.........",
      "......#...",
    ];
    const samplePossibilities = 6;

    it("finds all the spots we can put an obstruction to block the guard", () => {
      const testPatrols = findPossibleObstructions(sampleStartMap);
      const testCount = testPatrols.length;
      expect(testCount).toEqual(samplePossibilities);
    });
  });
}
