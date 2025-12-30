import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2025/day10/input.txt")) as string;

// known variables
const splitData = h.splitNewLines(initData);

// functions
interface Machine {
  indicatorMap: string;
  buttons: Array<number[]>;
  joltages: string;
  minPressesIndicators: number;
  minPressesJoltage: number;
}

function parseInput(input: Array<string>) {
  const machines: Array<Machine> = [];
  const regex = /\[([.#]+)\]\s(.+)\s{((?:\d+,?)+)}/;

  input.forEach((line) => {
    const splitLine = line.split(regex);

    const indicatorMap = splitLine[1];
    const joltages = splitLine[3];
    const buttons = splitLine[2].split(" ").map((button) => {
      return button
        .split(/(\d+)+/)
        .filter((val) => val !== "(" && val !== ")" && val !== ",")
        .map((val) => Number(val));
    });

    const machine: Machine = {
      indicatorMap,
      buttons,
      joltages,
      minPressesIndicators: 0,
      minPressesJoltage: 0,
    };

    machines.push(machine);
  });

  return machines;
}

// turns the machines on by running in indicator mode
function toggleOnMachines(machines: Array<Machine>) {
  machines.forEach((machine) => {
    const startState = {
      state: new Array(machine.indicatorMap.length).fill(".").join(""),
      presses: 0,
    };
    let queue = [startState];
    const visited = [startState.state];

    while (queue.length > 0) {
      const option = queue.shift()!;

      if (option.state === machine.indicatorMap) {
        machine.minPressesIndicators = option.presses;
        queue = [];
        return;
      }

      machine.buttons.forEach((button) => {
        // perform the toggle based on the button and make a new copy of the state based on option
        const currentState = option.state.split("");
        button.forEach((index) =>
          currentState[index] === "."
            ? (currentState[index] = "#")
            : (currentState[index] = ".")
        );
        const updatedState = currentState.join("");
        if (!visited.includes(updatedState)) {
          const newItem = {
            state: updatedState,
            presses: option.presses + 1,
          };
          queue.push(newItem);
          visited.push(updatedState);
        }
      });
    }
  });
}

// runs the machines in joltage mode
function adjustMachinesJoltage(machines: Array<Machine>) {
  machines.forEach((machine) => {
    const target = machine.joltages.split(",").map(Number);
    const result = solveLinearSystem(machine.buttons, target);
    machine.minPressesJoltage = result;
  });
}

// Not even gonna attempt to act like I wrote or fully understand this - thanks, Gemini. Dang linear algebra.
// Solves for x in Ax = B where A is buttons and B is targets.
// Handles cases where we have more buttons than targets (under-determined).
function solveLinearSystem(
  buttons: Array<number[]>,
  targets: number[]
): number {
  const numRows = targets.length;
  const numCols = buttons.length;

  // 1. Build the Augmented Matrix
  // We create a grid where each row is a counter, and columns are buttons.
  // The last column (index numCols) holds the target value.
  // We use Float64Array for precision, though standard JS numbers are doubles anyway.
  const matrix: number[][] = Array.from({ length: numRows }, () =>
    Array(numCols + 1).fill(0)
  );

  for (let col = 0; col < numCols; col++) {
    const buttonEffects = buttons[col];
    for (const row of buttonEffects) {
      // If button 'col' affects counter 'row', put a 1 there.
      if (row < numRows) {
        matrix[row][col] = 1;
      }
    }
  }

  // Fill the last column with targets
  for (let row = 0; row < numRows; row++) {
    matrix[row][numCols] = targets[row];
  }

  // 2. Gaussian Elimination (Forward Elimination)
  // We try to create a "staircase" of 1s down the diagonal.
  let pivotRow = 0;
  const pivotCols: number[] = []; // Keep track of which columns we successfully solved for
  const freeCols: number[] = []; // Columns we couldn't solve for (the "extra" buttons)

  for (let col = 0; col < numCols && pivotRow < numRows; col++) {
    // a. Find a row with a non-zero value in this column (the Pivot)
    let sel = -1;
    for (let row = pivotRow; row < numRows; row++) {
      if (Math.abs(matrix[row][col]) > 1e-9) {
        sel = row;
        break;
      }
    }

    if (sel === -1) {
      // No pivot found in this column? It's a "Free Variable" (extra button).
      freeCols.push(col);
      continue;
    }

    // b. Swap the selected row to the top (current pivotRow)
    [matrix[pivotRow], matrix[sel]] = [matrix[sel], matrix[pivotRow]];
    pivotCols.push(col);

    // c. Normalize the pivot row so the leading number is 1
    const val = matrix[pivotRow][col];
    for (let j = col; j <= numCols; j++) {
      matrix[pivotRow][j] /= val;
    }

    // d. Eliminate this column from all other rows
    for (let row = 0; row < numRows; row++) {
      if (row !== pivotRow) {
        const factor = matrix[row][col];
        if (Math.abs(factor) > 1e-9) {
          for (let j = col; j <= numCols; j++) {
            matrix[row][j] -= factor * matrix[pivotRow][j];
          }
        }
      }
    }

    pivotRow++;
  }

  // Collect any remaining columns as free if we didn't pivot on them
  for (let col = 0; col < numCols; col++) {
    if (!pivotCols.includes(col) && !freeCols.includes(col)) {
      freeCols.push(col);
    }
  }

  // 3. Solve for Variables
  // If we have Free Variables (extra buttons), we must search for the best combination.
  // If not, we just check the single solution.

  let minTotalPresses = Infinity;

  // Helper to check if a number is effectively an integer
  const isInt = (n: number) => Math.abs(n - Math.round(n)) < 1e-5;

  // Recursive function to try values for free variables
  // index: which free variable we are currently guessing
  // currentPresses: map of button index -> number of presses
  function searchFreeVariables(index: number, currentPresses: number[]) {
    // Optimization: If we already exceeded a known best, stop.
    const currentSum = currentPresses.reduce((a, b) => a + b, 0);
    if (currentSum >= minTotalPresses) return;

    // Base Case: All free variables have a value assigned
    if (index === freeCols.length) {
      // Now calculate the Dependent variables (the Pivots)
      // We work backwards up the rows
      let valid = true;
      const finalPresses = [...currentPresses];

      for (let i = pivotCols.length - 1; i >= 0; i--) {
        const pCol = pivotCols[i];
        const pRow = i; // Because we swapped rows, pivot i is at row i

        let sum = matrix[pRow][numCols]; // Start with target

        // Subtract effects of free variables
        for (const fCol of freeCols) {
          sum -= matrix[pRow][fCol] * finalPresses[fCol];
        }

        // Subtract effects of other pivots we already solved (though usually 0 due to elimination)
        // In Reduced Row Echelon Form, this loop isn't strictly needed if we fully reduced,
        // but good for safety if matrix isn't perfect identity.
        for (let j = i + 1; j < pivotCols.length; j++) {
          sum -= matrix[pRow][pivotCols[j]] * finalPresses[pivotCols[j]];
        }

        // The result is the presses for this button
        if (sum < -1e-9 || !isInt(sum)) {
          valid = false;
          break;
        }
        finalPresses[pCol] = Math.round(sum);
      }

      if (valid) {
        const total = finalPresses.reduce((a, b) => a + b, 0);
        if (total < minTotalPresses) {
          minTotalPresses = total;
        }
      }
      return;
    }

    // Recursive Step: Try values for this free variable
    // Since we want MIN presses, start small.
    // We limit the search range to avoid infinite loops.
    // In these puzzles, "redundant" buttons are rarely pressed huge amounts.
    // However, this is AoC which means we do need a decent range to search through - anything under 100 results in a final total that's too small.
    const colIdx = freeCols[index];
    for (let val = 0; val < 500; val++) {
      currentPresses[colIdx] = val;
      searchFreeVariables(index + 1, currentPresses);
      currentPresses[colIdx] = 0; // backtrack
    }
  }

  // Start the search
  // Initialize presses array
  const presses = new Array(numCols).fill(0);
  searchFreeVariables(0, presses);

  return minTotalPresses === Infinity ? 0 : minTotalPresses;
}



function countPresses(machines: Array<Machine>, type: "indicator" | "joltage") {
  if (type === "indicator") {
    const presses = machines.map((machine) => machine.minPressesIndicators);

    return presses.reduce((a, b) => a + b);
  } else {
    const presses = machines.map((machine) => machine.minPressesJoltage);

    return presses.reduce((a, b) => a + b);
  }
}

// part 1 logic
const machines = parseInput(splitData);
toggleOnMachines(machines);
const pressesOne = countPresses(machines, "indicator");
console.log(`part 1: ${pressesOne}`);

// part 2 logic
adjustMachinesJoltage(machines);
const pressesTwo = countPresses(machines, "joltage");
console.log(`part 2: ${pressesTwo}`);

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const sampleInput = [
    "[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}",
    "[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}",
    "[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}",
  ];
  const sampleMachines = [
    {
      indicatorMap: ".##.",
      buttons: [[3], [1, 3], [2], [2, 3], [0, 2], [0, 1]],
      joltages: "3,5,4,7",
      minPressesIndicators: 0,
      minPressesJoltage: 0,
    },
    {
      indicatorMap: "...#.",
      buttons: [
        [0, 2, 3, 4],
        [2, 3],
        [0, 4],
        [0, 1, 2],
        [1, 2, 3, 4],
      ],
      joltages: "7,5,12,7,2",
      minPressesIndicators: 0,
      minPressesJoltage: 0,
    },
    {
      indicatorMap: ".###.#",
      buttons: [
        [0, 1, 2, 3, 4],
        [0, 3, 4],
        [0, 1, 2, 4, 5],
        [1, 2],
      ],
      joltages: "10,11,11,5,10,5",
      minPressesIndicators: 0,
      minPressesJoltage: 0,
    },
  ];

  describe("part 1 test cases", () => {
    const sampleMinPresses = 7;

    it("solves part 1", () => {
      const testMachines = parseInput(sampleInput);
      expect(testMachines).toEqual(sampleMachines);
      toggleOnMachines(testMachines);
      const testMinPresses = countPresses(testMachines, "indicator");
      expect(testMinPresses).toEqual(sampleMinPresses);
    });
  });

  describe("part 2 test cases", () => {
    const sampleMinPresses = 33;

    it("solves part 2", () => {
      const testMachines = parseInput(sampleInput);
      expect(testMachines).toEqual(sampleMachines);
      adjustMachinesJoltage(testMachines);
      const testMinPresses = countPresses(testMachines, "joltage");
      expect(testMinPresses).toEqual(sampleMinPresses);
    });
  });
}
