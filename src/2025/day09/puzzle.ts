import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2025/day09/input.txt")) as string;

// known variables
const tilePoints = h.splitNewLines(initData).map((line) => {
  return line.split(",").map((val) => Number(val));
});

// functions
function calcArea(first: number[], second: number[]) {
  const width = Math.abs(first[0] - second[0]) + 1;
  const height = Math.abs(first[1] - second[1]) + 1;
  const area = width * height;
  return area;
}

function findLargestArea(input: number[][]) {
  let maxArea = 0;

  input.forEach((tile, i) => {
    const tilesLeft = input.slice(i + 1);

    for (const point of tilesLeft) {
      const area = calcArea(tile, point);

      if (area > maxArea) {
        maxArea = area;
      }
    }
  });

  return maxArea;
}

function findEdges(input: number[][]) {
  let minX = input[0][0];
  let maxX = input[0][0];
  let minY = input[0][1];
  let maxY = input[0][1];

  input.forEach((point) => {
    if (point[0] < minX) {
      minX = point[0];
    } else if (point[0] > maxX) {
      maxX = point[0];
    }
    if (point[1] < minY) {
      minY = point[1];
    } else if (point[1] > maxY) {
      maxY = point[1];
    }
  });

  return [minX, maxX, minY, maxY];
}

function buildGrid(input: number[][]): number[][] {
  const [minX, maxX, minY, maxY] = findEdges(input);

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  const padding = 1;

  const gridW = width + padding * 2;
  const gridH = height + padding * 2;

  const grid = Array.from({ length: gridH }, () => new Array(gridW).fill(0));
  return grid;
}

function buildPrefixTable(grid: number[][]) {
  const table: number[][] = [];

  for (let r = 0; r < grid.length; r++) {
    table[r] = [];
    for (let c = 0; c < grid[0].length; c++) {
      const curr = grid[r][c];
      const above = table[r - 1]?.[c] ?? 0;
      const left = table[r][c - 1] ?? 0;
      const diag = table[r - 1]?.[c - 1] ?? 0;

      table[r][c] = curr + above + left - diag;
    }
  }

  return table;
}

function findLargestFilledArea(input: number[][]) {
  const [minX, maxX, minY, maxY] = findEdges(input);
  const mapGrid = buildGrid(input);

  // plot the red tiles and any connecting green tiles to form the boundary of the shape
  for (let i = 0; i < input.length; i++) {
    const currPoint = input[i];
    const nextPoint = input[i + 1 < input.length ? i + 1 : 0];

    if (currPoint[0] === nextPoint[0]) {
      const x = currPoint[0];
      const start = Math.min(currPoint[1], nextPoint[1]);
      const end = Math.max(currPoint[1], nextPoint[1]);

      for (let p = start; p <= end; p++) {
        const col = x - minX + 1;
        const row = p - minY + 1;
        mapGrid[row][col] = 1;
      }
    } else {
      const y = currPoint[1];
      const start = Math.min(currPoint[0], nextPoint[0]);
      const end = Math.max(currPoint[0], nextPoint[0]);

      for (let p = start; p <= end; p++) {
        const col = p - minX + 1;
        const row = y - minY + 1;
        mapGrid[row][col] = 1;
      }
    }
  }

  // then need to fill the shape so we know if a tile is inside or outside
  const queue: number[][] = [[0, 0]];

  while (queue.length > 0) {
    const coord = queue.shift()!;
    if (
      0 <= coord[0] &&
      coord[0] <= maxY + 1 &&
      0 <= coord[1] &&
      coord[1] <= maxX + 1
    ) {
      if (
        mapGrid[coord[0]][coord[1]] !== 1 &&
        mapGrid[coord[0]][coord[1]] !== -1
      ) {
        mapGrid[coord[0]][coord[1]] = -1;
        queue.push([coord[0] - 1, coord[1]]);
        queue.push([coord[0] + 1, coord[1]]);
        queue.push([coord[0], coord[1] - 1]);
        queue.push([coord[0], coord[1] + 1]);
      }
    }
  }

  for (let i = 0; i < mapGrid.length; i++) {
    for (let j = 0; j < mapGrid[0].length; j++) {
      if (mapGrid[i][j] === 0) {
        mapGrid[i][j] = 1;
      }
    }
  }

  // now we do a 2d prefix sum table, this gives us a value of the area for that cell starting from 0,0. we can use this to then compare against the area we get for the coords we want to compare - if the two values match all the values inside the rectangle were valid (otherwise the sum table will be lower since it had -1s in it so it's not valid)
  const prefixTable = buildPrefixTable(mapGrid);
  console.log({ prefixTable });

  let maxArea = 0;

  input.forEach((tile, i) => {
    const tilesLeft = input.slice(i + 1);

    for (const point of tilesLeft) {
      const area = calcArea(tile, point);
      // somehow here need to determine which of tile or point is the topleft and which is the bottomright

      // then need to access the values by subtracting them from the global mins and adding 1 to access the right spot in the table

      // then use the formula below to calculate the prefix sum and add that comparison to the if statement so we do that and then the area check

      if (area > maxArea) {
        maxArea = area;
      }
    }
  });

  //   $$ \text{Sum} = P[r2][c2] - P[r1-1][c2] - P[r2][c1-1] + P[r1-1][c1-1] $$

  // Where $P$ is your prefix sum table.

  // Start with the large sum ending at the bottom-right (r2, c2). This covers your rectangle but also includes unwanted areas above and to the left.
  // Subtract the area "above" (ending at r1-1).
  // Subtract the area "left" (ending at c1-1).
  // Add back the top-left corner (ending at r1-1, c1-1). You add this back because you subtracted that corner region twice (once with the "above" part and once with the "left" part).

  return maxArea;
}

// part 1 logic
const maxAreaOne = findLargestArea(tilePoints);
console.log(`part 1: ${maxAreaOne}`);

// part 2 logic

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("part 1 test cases", () => {
    const sampleInput = [
      [7, 1],
      [11, 1],
      [11, 7],
      [9, 7],
      [9, 5],
      [2, 5],
      [2, 3],
      [7, 3],
    ];
    const sampleMaxArea = 50;

    it("finds the largest area for part 1", () => {
      const testMaxArea = findLargestArea(sampleInput);
      expect(testMaxArea).toEqual(sampleMaxArea);
    });
  });

  describe("part 2 test cases", () => {
    const sampleInput = [
      [7, 1],
      [11, 1],
      [11, 7],
      [9, 7],
      [9, 5],
      [2, 5],
      [2, 3],
      [7, 3],
    ];
    const sampleMaxArea = 24;

    it("finds the largest area for part 2", () => {
      const testMaxArea = findLargestFilledArea(sampleInput);
      expect(testMaxArea).toEqual(sampleMaxArea);
    });
  });
}
