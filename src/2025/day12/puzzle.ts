import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2025/day12/input.txt")) as string;

// known variables
const splitData = h.splitNewLines(initData);

// functions
function parseInput(input: string[]) {
  const regionStart = input.findIndex((row) => row.match(/\d+x\d+:/) !== null);
  const regionList = input.slice(regionStart);

  const shapeList: any = [];
  let shapeIdx = 0;
  let currShape: string[] = [];

  for (let i = 0; i < regionStart; i++) {
    if (input[i].includes(":")) {
      // start of a new shape
      shapeIdx = Number(input[i].charAt(0));
    } else if (input[i] === "") {
      // end of a shape
      shapeList.push([shapeIdx, currShape]);
      currShape = [];
    } else {
      // middle of a shape
      currShape.push(input[i]);
    }
  }

  return [shapeList, regionList];
}

// normalizes an array, so all of the values are positive
function normalize(arr) {
  const allRVals = arr.map((coord) => coord[0]);
  const allCVals = arr.map((coord) => coord[1]);
  const minR = Math.min(...allRVals);
  const minC = Math.min(...allCVals);

  const normalizedArr = arr.map((coord) => [coord[0] - minR, coord[1] - minC]);
  return normalizedArr;
}

// builds out all the potential orientations a shape can fit into - so adds the original shape, that shape rotated 90 degrees 3 times, a flipped version of the original, and that flipped version rotated 90 degrees 3 times. normalizes all the orientations so they're always positive and deduplicates any that might end up the same to keep the size of the options unique
function buildShapeObject(shape: string[]) {
  const allOrientations: Array<number[][]> = [];
  const original: Array<number[]> = [];

  for (let r = 0; r < shape.length; r++) {
    const row = shape[r].split("");
    for (let c = 0; c < row.length; c++) {
      const val = row[c];
      if (val === "#") {
        original.push([r, c]);
      }
    }
  }

  allOrientations.push(original);

  // now need to generate the 3 90 degree rotations for the original shape
  // rows become columns, and columns become rows (but inverted): (r, c) -> (c, -r).
  // rotating off the last shape added to the orientation list, so it's always 90 degrees
  for (let i = 0; i < 3; i++) {
    const rotated = allOrientations[allOrientations.length - 1].map((coord) => {
      const newR = coord[1];
      const newC = coord[0] * -1;
      return [newR, newC];
    });

    // then need to normalize, so there's no negative values
    const normalizedRotated = normalize(rotated);
    allOrientations.push(normalizedRotated);
  }

  // then flip the original and do it and it's 3 90 degree rotations
  // The row stays the same, but the column is negated.: (r, c) -> (r, -c).
  const flipped = original.map((coord) => {
    const newC = coord[1] * -1;
    return [coord[0], newC];
  });

  // flipped also has to be normalized
  const normalizedFlipped = normalize(flipped);
  allOrientations.push(normalizedFlipped);

  for (let i = 0; i < 3; i++) {
    const rotated = allOrientations[allOrientations.length - 1].map((coord) => {
      const newR = coord[1];
      const newC = coord[0] * -1;
      return [newR, newC];
    });

    const normalizedRotated = normalize(rotated);
    allOrientations.push(normalizedRotated);
  }

  const uniqueOrientations: Array<number[][]> = [];

  // have to now sort the coords in each orientation and make a string version of it to compare against
  const sortedOrientations = allOrientations.map((orientation) =>
    orientation.sort((coordA, coordB) => {
      const rowDiff = coordA[0] - coordB[0];
      const colDiff = coordA[1] - coordB[1];
      return rowDiff || colDiff;
    })
  );

  const uniqueStringOrientations = new Set<string>();
  for (const orientation of sortedOrientations) {
    const strVersion = JSON.stringify(orientation);
    if (!uniqueStringOrientations.has(strVersion)) {
      uniqueStringOrientations.add(strVersion);
      uniqueOrientations.push(orientation);
    }
  }

  return uniqueOrientations;
}

// clearly not written by me :(
function canFit(
  grid: boolean[][],
  shape: number[][],
  r: number,
  c: number,
  W: number,
  H: number
): boolean {
  for (const [dr, dc] of shape) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr < 0 || nr >= H || nc < 0 || nc >= W || grid[nr][nc]) {
      return false;
    }
  }
  return true;
}

// also clearly not written by me :(
function place(
  grid: boolean[][],
  shape: number[][],
  r: number,
  c: number,
  val: boolean
) {
  for (const [dr, dc] of shape) {
    grid[r + dr][c + dc] = val;
  }
}

// also also clearly not written by me :(
function solve(
  grid: boolean[][],
  counts: Map<number, number>,
  remaining: number,
  shapes: Map<number, number[][][]>,
  sortedIds: number[],
  W: number,
  H: number
): boolean {
  // Base Case: If no presents (or gaps) remain to be placed, we have successfully filled the region.
  if (remaining === 0) return true;

  let r = -1;
  let c = -1;

  // Optimization: "First Empty Cell" Strategy.
  // Instead of trying to place a present anywhere, we find the very first empty coordinate (top-left).
  // We MUST fill this specific cell with *something* (a present or a gap filler).
  // This drastically reduces the search space compared to trying every present in every location.
  outer: for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!grid[y][x]) {
        r = y;
        c = x;
        break outer;
      }
    }
  }

  // If no empty cell was found but 'remaining' > 0, something went wrong with counting,
  // or we are done. (Should be covered by base case, but safety check).
  if (r === -1) return true;

  for (const id of sortedIds) {
    const count = counts.get(id)!;
    if (count > 0) {
      const orientations = shapes.get(id)!;
      for (const shape of orientations) {
        // Try to place the current shape orientation at the target cell (r, c)
        if (canFit(grid, shape, r, c, W, H)) {
          place(grid, shape, r, c, true);
          counts.set(id, count - 1);

          // Recursive step: Move to the next state
          if (solve(grid, counts, remaining - 1, shapes, sortedIds, W, H)) {
            return true;
          }

          // Backtracking: If the recursive call failed, undo the placement
          counts.set(id, count);
          place(grid, shape, r, c, false);
        }
      }
    }
  }

  return false;
}

function attemptPresentPacking(shapeList, regionList) {
  // first we build out a map of our shapes with all potential flips/rotations
  const shapes = new Map();
  shapeList.forEach((shape) => {
    const shapeObj = buildShapeObject(shape[1]);

    // Anchor orientations to (0,0) based on top-left-most cell.
    // This is crucial for the "First Empty Cell" strategy. It ensures that when we try to
    // place a shape at grid[r][c], the shape's first occupied cell lands exactly on [r][c].
    const anchored = shapeObj.map((ori: number[][]) => {
      let minC = Infinity;
      for (const [r, c] of ori) {
        if (r === 0 && c < minC) minC = c;
      }
      return ori.map(([r, c]) => [r, c - minC]);
    });

    shapes.set(shape[0], anchored);
  });

  let regionsThatFit = 0;

  for (let i = 0; i < regionList.length; i++) {
    const data = regionList[i].split(": ");
    const [width, height] = data[0].split("x").map((val) => Number(val));
    const shapesCount = data[1].split(" ").map((val) => Number(val));

    const counts = new Map<number, number>();
    let totalPresents = 0;

    shapesCount.forEach((count, idx) => {
      if (count > 0) {
        counts.set(idx, count);
        totalPresents += count;
      }
    });

    // Handle gaps by calculating total area vs region area.
    // The "Exact Cover" algorithm requires the grid to be perfectly full.
    // If the presents don't fill the area, we create 1x1 "Gap" presents to fill the rest.
    let totalArea = 0;
    counts.forEach((cnt, id) => {
      totalArea += cnt * shapes.get(id)[0].length;
    });

    const gapCount = width * height - totalArea;
    if (gapCount < 0) continue; // Impossible if presents are larger than region

    if (gapCount > 0) {
      // Add a virtual 1x1 "gap" shape (ID -1)
      counts.set(-1, gapCount);
      shapes.set(-1, [[[0, 0]]]);
      totalPresents += gapCount;
    }

    // Heuristic: Sort shapes by size (largest first).
    // It is usually harder to place large shapes. Failing fast on large shapes speeds up the search.
    const sortedIds = Array.from(counts.keys()).sort((a, b) => {
      const shapeA = shapes.get(a);
      const shapeB = shapes.get(b);
      const sizeA = shapeA[0].length;
      const sizeB = shapeB[0].length;
      if (sizeB !== sizeA) return sizeB - sizeA;
      return a - b;
    });

    const grid = Array(height)
      .fill(null)
      .map(() => Array(width).fill(false));

    if (solve(grid, counts, totalPresents, shapes, sortedIds, width, height)) {
      regionsThatFit++;
    }
  }
  return regionsThatFit;
}

// part 1 logic
const [realShapes, realRegions] = parseInput(splitData);
const regionCount = attemptPresentPacking(realShapes, realRegions);
console.log(`part 1: ${regionCount}`);

// part 2 logic
console.log(`part 2: we made it horrayyyyy`)

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("part 1 test cases", () => {
    const sampleInput = [
      "0:",
      "###",
      "##.",
      "##.",
      "",
      "1:",
      "###",
      "##.",
      ".##",
      "",
      "2:",
      ".##",
      "###",
      "##.",
      "",
      "3:",
      "##.",
      "###",
      "##.",
      "",
      "4:",
      "###",
      "#..",
      "###",
      "",
      "5:",
      "###",
      ".#.",
      "###",
      "",
      "4x4: 0 0 0 0 2 0",
      "12x5: 1 0 1 0 2 2",
      "12x5: 1 0 1 0 3 2",
    ];
    const sampleGoodRegions = 2;

    it("solves part 1", () => {
      const [testShapes, testRegions] = parseInput(sampleInput);
      const testLegitRegionCount = attemptPresentPacking(
        testShapes,
        testRegions
      );
      expect(testLegitRegionCount).toEqual(sampleGoodRegions);
    });
  });
}
