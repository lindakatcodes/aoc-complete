import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2015/day01/input.txt")) as string;

// known variables
const startingFloor = 0;
const up = "(";
const basement = -1;

// functions
function findTheFloor(path: string): number {
  let currentFloor = startingFloor;

  path
    .split("")
    .forEach((dir) => (dir === up ? (currentFloor += 1) : (currentFloor -= 1)));

  return currentFloor;
}

function findFirstBasementPosition(path: string): number {
  let currentFloor = startingFloor;
  let foundPosition = false;
  let basementPosition = 0;

  path.split("").map((dir, index) => {
    if (foundPosition) return;
    dir === up ? (currentFloor += 1) : (currentFloor -= 1);
    if (currentFloor === basement) {
      // +1 because JS is 0 indexed, naturally
      basementPosition = index + 1;
      foundPosition = true;
    }
  });

  return basementPosition;
}

// part 1 logic
const rightFloor = findTheFloor(initData);
console.log({ part1: rightFloor });

// part 2 logic
const firstBasementTouch = findFirstBasementPosition(initData);
console.log({ part2: firstBasementTouch });

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("part 1 test cases", () => {
    const sampleInput = [
      "(())",
      "()()",
      "(((",
      "(()(()(",
      "))(((((",
      "())",
      "))(",
      ")))",
      ")())())",
    ];
    const expectedAnswers = [0, 0, 3, 3, 3, -1, -1, -3, -3];
    const testAnswers: number[] = [];

    it("calculates the correct floor level", () => {
      sampleInput.forEach((test, index) => {
        const answer = findTheFloor(test);
        expect(answer).toEqual(expectedAnswers[index]);
        testAnswers.push(answer);
      });
      expect(testAnswers).toEqual(expectedAnswers);
    });
  });

  describe("part 2 test cases", () => {
    const sampleInput = [")", "()())", "())()"];
    const expectedAnswers = [1, 5, 3];

    it("finds the right position of the first basement level", () => {
      sampleInput.forEach((test, index) => {
        const answer = findFirstBasementPosition(test);
        expect(answer).toEqual(expectedAnswers[index]);
      });
    });
  });
}
