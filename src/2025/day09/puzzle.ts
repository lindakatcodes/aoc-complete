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

// honestly don't even know what's going on here anymore, i gave up :(
function findLargestFilledArea(input: number[][]) {
  // Coordinate Compression to handle large inputs
  const xSet = new Set<number>();
  const ySet = new Set<number>();
  input.forEach(([x, y]) => {
    xSet.add(x);
    ySet.add(y);
  });

  const minX = Math.min(...xSet);
  const maxX = Math.max(...xSet);
  const minY = Math.min(...ySet);
  const maxY = Math.max(...ySet);

  // Add padding for flood fill
  xSet.add(minX - 1);
  xSet.add(maxX + 1);
  ySet.add(minY - 1);
  ySet.add(maxY + 1);

  const xs = Array.from(xSet).sort((a, b) => a - b);
  const ys = Array.from(ySet).sort((a, b) => a - b);

  const xMap = new Map<number, number>();
  xs.forEach((x, i) => xMap.set(x, i * 2));
  const yMap = new Map<number, number>();
  ys.forEach((y, i) => yMap.set(y, i * 2));

  const gridW = xs.length * 2 - 1;
  const gridH = ys.length * 2 - 1;

  // Use Int8Array for memory efficiency
  const grid = new Int8Array(gridW * gridH);

  // Draw boundaries
  for (let i = 0; i < input.length; i++) {
    const currPoint = input[i];
    const nextPoint = input[i + 1 < input.length ? i + 1 : 0];

    const c1 = xMap.get(currPoint[0])!;
    const r1 = yMap.get(currPoint[1])!;
    const c2 = xMap.get(nextPoint[0])!;
    const r2 = yMap.get(nextPoint[1])!;

    const cStart = Math.min(c1, c2);
    const cEnd = Math.max(c1, c2);
    const rStart = Math.min(r1, r2);
    const rEnd = Math.max(r1, r2);

    for (let r = rStart; r <= rEnd; r++) {
      for (let c = cStart; c <= cEnd; c++) {
        grid[r * gridW + c] = 1;
      }
    }
  }

  // Flood fill from (0,0) - which corresponds to minX-1, minY-1 (outside)
  const stack = [0];
  grid[0] = -1;

  while (stack.length > 0) {
    const idx = stack.pop()!;
    const r = Math.floor(idx / gridW);
    const c = idx % gridW;

    const neighbors = [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ];

    for (const [nr, nc] of neighbors) {
      if (nr >= 0 && nr < gridH && nc >= 0 && nc < gridW) {
        const nIdx = nr * gridW + nc;
        if (grid[nIdx] === 0) {
          grid[nIdx] = -1;
          stack.push(nIdx);
        }
      }
    }
  }

  // Build Prefix Table (counting non-outside cells)
  const prefix = new Int32Array(gridW * gridH);
  for (let r = 0; r < gridH; r++) {
    for (let c = 0; c < gridW; c++) {
      const val = grid[r * gridW + c] === -1 ? 0 : 1;
      const above = r > 0 ? prefix[(r - 1) * gridW + c] : 0;
      const left = c > 0 ? prefix[r * gridW + (c - 1)] : 0;
      const diag = r > 0 && c > 0 ? prefix[(r - 1) * gridW + (c - 1)] : 0;
      prefix[r * gridW + c] = val + above + left - diag;
    }
  }

  function getSum(r1: number, c1: number, r2: number, c2: number) {
    const p = (r: number, c: number) =>
      r < 0 || c < 0 ? 0 : prefix[r * gridW + c];
    return p(r2, c2) - p(r1 - 1, c2) - p(r2, c1 - 1) + p(r1 - 1, c1 - 1);
  }

  let maxArea = 0;

  input.forEach((tile, i) => {
    const tilesLeft = input.slice(i + 1);

    for (const point of tilesLeft) {
      const area = calcArea(tile, point);

      const c1 = xMap.get(Math.min(tile[0], point[0]))!;
      const c2 = xMap.get(Math.max(tile[0], point[0]))!;
      const r1 = yMap.get(Math.min(tile[1], point[1]))!;
      const r2 = yMap.get(Math.max(tile[1], point[1]))!;

      const totalCells = (r2 - r1 + 1) * (c2 - c1 + 1);
      const filledCells = getSum(r1, c1, r2, c2);

      if (filledCells === totalCells && area > maxArea) {
        maxArea = area;
      }
    }
  });

  return maxArea;
}

// part 1 logic
const maxAreaOne = findLargestArea(tilePoints);
console.log(`part 1: ${maxAreaOne}`);

// part 2 logic
const maxAreaTwo = findLargestFilledArea(tilePoints);
console.log(`part 2: ${maxAreaTwo}`);

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
