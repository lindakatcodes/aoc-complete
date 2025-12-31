import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2025/day12/input.txt")) as string;

// known variables

// functions
function parseInput(input: string[]) {
  const regionStart = input.findIndex((row) => row.match(/\d+x\d:/) !== null);
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

/* 
Instead of a grid of # and ., think of a shape as a collection of (row, col) offsets relative to an origin point (usually the top-left corner (0,0)).

Let's look at your example, Shape 0:
###
##.
##.

If we treat the top-left character as (0,0), we iterate through the string grid. Every time we see a #, we record its coordinate.

Base Orientation (0 degrees):
Row 0: (0,0), (0,1), (0,2)
Row 1: (1,0), (1,1)
Row 2: (2,0), (2,1)
So, in memory, Shape 0 is just a list of points: [(0,0), (0,1), (0,2), (1,0), (1,1), (2,0), (2,1)]

2. Generating Orientations (The Data Pipeline)
Step A: Parse Convert the input string into that initial list of coordinates I showed above.

Step B: Transform (Rotate/Flip) To generate the other views, you apply a mathematical transformation to every coordinate in that list. 8 possible orientations - 4 original, 4 flipped

90 Degree Rotation - To rotate 90 degrees, rows become columns, and columns become rows (but inverted): (r, c) -> (c, -r).
Flip - You can flip across the vertical axis (like turning a page in a book). The row stays the same, but the column is negated.: (r, c) -> (r, -c).

Step C: Normalize This is the most important step. If you apply (c, -r) to (0, 2), you get (2, 0). But if you apply it to (1, 1), you get (1, -1). You can't have negative indices in your array! To fix this, after rotating all points, find the minimum row and minimum column in the new list. Subtract those minimums from every point. This shifts the shape back so it fits snugly against the (0,0) top-left corner.
Look at all the points in your transformed list.
Find the minimum row value (min_r) in that list.
Find the minimum column value (min_c) in that list.
For every point (r, c) in the list, calculate:
final_r = r - min_r
final_c = c - min_c
Coordinates: [(0,0), (0,1), (1,0)]

Step A: Rotate 90 Degrees
Let's apply the formula (c, -r) to our list.

(0,0) $\rightarrow$ (0, -0) $\rightarrow$ (0, 0)
(0,1) $\rightarrow$ (1, -0) $\rightarrow$ (1, 0)
(1,0) $\rightarrow$ (0, -1) $\rightarrow$ (0, -1)
Intermediate List: [(0,0), (1,0), (0,-1)]

Notice we have a negative number (-1). We can't use that as an array index! This is why we normalize.

Step B: Normalize
Look at the intermediate list: [(0,0), (1,0), (0,-1)]

Find Min Row: The row values are 0, 1, 0. The minimum is 0.
Find Min Col: The col values are 0, 0, -1. The minimum is -1.
Now, subtract these minimums from every point:

final_r = r - 0
final_c = c - (-1) (which is c + 1)
Apply Shift:

(0, 0) $\rightarrow$ (0-0, 0+1) $\rightarrow$ (0, 1)
(1, 0) $\rightarrow$ (1-0, 0+1) $\rightarrow$ (1, 1)
(0, -1) $\rightarrow$ (0-0, -1+1) $\rightarrow$ (0, 0)
Final Normalized List: [(0,1), (1,1), (0,0)]
worth noting the coords won't necessary by in the order you expect - but if you were to plot them on the grid, they'd look correct

Step D: Deduplicate Some shapes (like a square or a cross) look the same after rotation. You should store the normalized coordinate lists in a Set or check for existence before adding them to your list of orientations to avoid doing the same work twice during the solving phase.
*/
function buildShapeObject(shape: string[]) {
  console.log({ shape });
}

/* 
The Algorithm: Backtracking
Since you need to find if they fit, this is a perfect candidate for Recursive Backtracking. Imagine you are solving a jigsaw puzzle.

Here is the logical flow you should aim to implement:

The Goal: Place all required presents onto the grid such that no two overlap and they stay within bounds.
The Function: Create a recursive function (e.g., solve(current_present_index, current_grid_state)).
The Recursive Steps:

Base Case: If you have successfully placed all the presents, return True. You're done!
Find a Spot: Look at your grid. Find the first empty cell (usually scanning top-to-bottom, left-to-right). This is where you must place a piece of a present to fill that hole (or, alternatively, you can iterate through the list of presents and try to place the current present in the first valid spot it fits).
Note: A common optimization in tiling problems is to always try to fill the first available empty cell on the grid. This reduces the search space significantly compared to trying to put a piece anywhere.
Try Orientations: Take the next present you need to place. Iterate through all its pre-calculated variations (rotations/flips).
Check Validity: For the current variation, check:
Does it go out of bounds?
Does it overlap with an existing # on the grid?
Place and Recurse:
If it fits, "place" it (mark those spots on your grid as occupied).
Call your recursive function again for the next present.
If that recursive call returns True, then propagate that True up. You found a solution.
Backtrack:
If the recursive call returns False (meaning that placement led to a dead end later on), you must undo your move.
Unmark the spots on the grid (make them empty again).
Loop to the next orientation/variation.
Failure: If you try all variations and none work, return False.
4. Helper Functions
To keep your code clean, you should write helper functions for the specific checks. You might want logic like:

can_place(grid, shape, x, y): Returns true if the shape fits at coordinates x, y.
place(grid, shape, x, y): Updates the grid.
remove(grid, shape, x, y): Reverses the update.
5. A Quick Optimization Check
Before you even start the recursion, is there a simple math check you can do?

Calculate the total area of the region (Width $\times$ Height).
Calculate the total area of all presents (count the #s).
If the presents have more area than the region, you know immediately it's impossible.
*/
function attemptPresentPacking(shapeList, regionList) {
  // first we build out a map of our shapes with all potential flips/rotations
  const shapes = new Map();
  shapeList.forEach((shape) => {
    const shapeObj = buildShapeObject(shape[1]);
    shapes.set(shape[0], shapeObj);
  });
  console.log({ shapes });
}

// part 1 logic
// console.log(`part 1: ${}`)

// part 2 logic
// console.log(`part 2: ${}`)

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

  describe.todo("part 2 test cases", () => {
    const sampleInput = [];
    const sampleAnswers = [];

    it("solves part 2", () => {});
  });
}
