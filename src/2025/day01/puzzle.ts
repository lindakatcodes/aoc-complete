import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2025/day01/input.txt")) as string;

// known variables
const start = 50;
const instructions = h.splitNewLines(initData);

// functions
// return the result of following the instructions
function calcRotations(inputArr): number[] {
  let current = start;

  const path = inputArr.map((direction) => {
    const sign = direction.charAt(0);
    const val = Number(direction.slice(1));

    const nextMove = sign === "L" ? -val : val;

    let nextVal = current + nextMove;
    if (nextVal >= 100 || nextVal < 0) {
      const diff = nextVal % 100;
      nextVal = Math.sign(diff) === -1 ? diff + 100 : diff;
    }
    current = nextVal === 100 ? 0 : nextVal;
    return nextVal;
  });

  return path;
}

// count the number of 0 in the array
function countZeroes(rotationArr): number {
  return rotationArr.filter((val) => val === 0).length;
}

// couldn't solve this without ai help, and even still don't get this, but whatever
// count the number of times we cross 0 during the rotations
function calcZeroes(inputArr: string[]): number {
  let current = start;
  let total = 0;

  for (const direction of inputArr) {
    const sign = direction.charAt(0);
    const val = Number(direction.slice(1));

    // compute the first step k (1-based) within this rotation that will land on 0
    // For R: current + k ≡ 0 (mod 100) => k ≡ (100 - current) mod 100
    // For L: current - k ≡ 0 (mod 100) => k ≡ current mod 100
    let firstK = sign === "R" ? (100 - current) % 100 : current % 100;
    if (firstK === 0) firstK = 100; // k=0 is not a valid step; the first valid k is 100

    if (val >= firstK) {
      total += Math.floor((val - firstK) / 100) + 1;
    }

    // update current to the end of this rotation
    let next = current + (sign === "L" ? -val : val);
    next = ((next % 100) + 100) % 100;
    current = next;
  }

  return total;
}

// part 1 logic
const rotations = calcRotations(instructions);
const zeroes = countZeroes(rotations);
console.log("part 1: ", zeroes);

// part 2 logic
const zeroesTwo = calcZeroes(instructions);
console.log("part 2: ", zeroesTwo);

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("part 1 test cases", () => {
    const sampleInput = [
      "L68",
      "L30",
      "R48",
      "L5",
      "R60",
      "L55",
      "L1",
      "L99",
      "R14",
      "L82",
    ];
    const sampleRotations = [82, 52, 0, 95, 55, 0, 99, 0, 14, 32];
    const samplePassword = 3;

    it("finds the correct rotation values and password", () => {
      const testRotations = calcRotations(sampleInput);
      expect(testRotations).toEqual(sampleRotations);
      const testPassword = countZeroes(testRotations);
      expect(testPassword).toEqual(samplePassword);
    });
  });

  describe("part 2 test cases", () => {
    const sampleInput = [
      "L68",
      "L30",
      "R48",
      "L5",
      "R60",
      "L55",
      "L1",
      "L99",
      "R14",
      "L82",
    ];
    const samplePassword = 6;

    it("finds the right count of zeroes during rotations and at the ends to get the right password", () => {
      const testPassword = calcZeroes(sampleInput);
      expect(testPassword).toEqual(samplePassword);
    });
  });
}
