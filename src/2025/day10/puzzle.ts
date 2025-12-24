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
    const result = solveILP(machine.buttons, target);
    machine.minPressesJoltage = result;
  });
}

function solveILP(buttons: number[][], target: number[]): number {
  const numButtons = buttons.length;
  const numCounters = target.length;

  // Build constraint matrix A where A[i][j] = 1 if button j affects counter i
  const A: number[][] = Array.from({ length: numCounters }, () =>
    new Array(numButtons).fill(0)
  );

  buttons.forEach((button, btnIdx) => {
    button.forEach((counterIdx) => {
      A[counterIdx][btnIdx] = 1;
    });
  });

  // Try all reasonable combinations (bounded search)
  const maxTotal = target.reduce((sum, t) => sum + t, 0);
  let bestSolution: number[] | null = null;
  let bestCost = Infinity;

  // Use recursive search with aggressive pruning
  function search(
    presses: number[],
    btnIdx: number,
    totalPresses: number
  ): void {
    if (totalPresses >= bestCost) return; // Prune

    if (btnIdx === numButtons) {
      // Check if this satisfies all constraints
      const achieved = new Array(numCounters).fill(0);
      buttons.forEach((button, idx) => {
        button.forEach((cIdx) => {
          achieved[cIdx] += presses[idx];
        });
      });

      if (
        achieved.every((val, i) => val === target[i]) &&
        totalPresses < bestCost
      ) {
        bestCost = totalPresses;
        bestSolution = [...presses];
      }
      return;
    }

    // Determine bounds for this button
    // Lower bound: 0
    // Upper bound: max value in targets (conservative)
    const upperBound = Math.max(...target);

    for (
      let presses_i = 0;
      presses_i <= Math.min(upperBound, maxTotal - totalPresses);
      presses_i++
    ) {
      presses[btnIdx] = presses_i;
      search(presses, btnIdx + 1, totalPresses + presses_i);

      // Early termination if we found a very good solution
      if (bestCost === Math.max(...target)) break;
    }
  }

  search(new Array(numButtons).fill(0), 0, 0);

  return bestSolution ? bestCost : -1;
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
