import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2025/day02/input.txt")) as string;

// known variables
const ranges = initData.split(",");

// functions
function findInvalidIdsOne(inputArr: string[]): number[] {
  const invalids: number[] = [];

  for (const range of inputArr) {
    const [start, end] = range.split("-").map((val) => Number(val));
    let current = start;

    while (current <= end) {
      // if the number is odd it can't be evenly repeated twice so move on
      const size = current.toString().length;
      if (size % 2 !== 0) {
        current++;
        continue;
      }

      // otherwise split it, find the half value, and compare left and right
      const split = current.toString().split("");
      const half = size / 2;
      const left = split.slice(0, half).join();
      const right = split.slice(half).join();
      if (left === right) {
        invalids.push(current);
      }
      current++;
    }
  }

  return invalids;
}

function findInvalidIdsTwo(inputArr: string[]): number[] {
  const invalids: Set<number> = new Set();

  for (const range of inputArr) {
    const [start, end] = range.split("-").map((val) => Number(val));
    let current = start;

    while (current <= end) {
      // console.log({ current });
      const fullLength = current.toString().length;
      const split = current.toString().split("");

      // get what numbers can actually divide into the total length and be repeated
      const divisors: number[] = [];
      for (let i = 1; i < fullLength; i++) {
        if (fullLength % i === 0) {
          divisors.push(i);
        }
      }
      // console.log({ divisors });

      divisors.forEach((num) => {
        const sub = split.slice(0, num).join("");
        const subTest = sub.repeat(fullLength / num);
        // console.log({ sub, subTest });
        if (subTest === current.toString()) {
          invalids.add(current);
        }
      });
      // console.log({ invalids });
      current++;
    }
  }

  return Array.from(invalids);
}

function sumInvalids(numArr: number[]): number {
  return h.sumNumberArray(numArr);
}

// part 1 logic
const invalidIds = findInvalidIdsOne(ranges);
const invalidSum = sumInvalids(invalidIds);
console.log("part 1: ", invalidSum);

// part 2 logic
const invalidsTwo = findInvalidIdsTwo(ranges);
const invalidSumTwo = sumInvalids(invalidsTwo);
console.log("part 2: ", invalidSumTwo);

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("part 1 test cases", () => {
    const sampleInput = [
      "11-22",
      "95-115",
      "998-1012",
      "1188511880-1188511890",
      "222220-222224",
      "1698522-1698528",
      "446443-446449",
      "38593856-38593862",
      "565653-565659",
      "824824821-824824827",
      "2121212118-2121212124",
    ];
    const sampleInvalids = [
      11, 22, 99, 1010, 1188511885, 222222, 446446, 38593859,
    ];
    const sampleSum = 1227775554;

    it("finds all the invalid ids and sums them together", () => {
      const testInvalids = findInvalidIdsOne(sampleInput);
      expect(testInvalids).toEqual(sampleInvalids);
      const testSum = sumInvalids(testInvalids);
      expect(testSum).toEqual(sampleSum);
    });
  });

  describe("part 2 test cases", () => {
    const sampleInput = [
      "11-22",
      "95-115",
      "998-1012",
      "1188511880-1188511890",
      "222220-222224",
      "1698522-1698528",
      "446443-446449",
      "38593856-38593862",
      "565653-565659",
      "824824821-824824827",
      "2121212118-2121212124",
    ];
    const sampleInvalids = [
      11, 22, 99, 111, 999, 1010, 1188511885, 222222, 446446, 38593859, 565656,
      824824824, 2121212121,
    ];
    const sampleSum = 4174379265;

    it("finds invalid ids that match a pattern twice and sums them together", () => {
      const testInvalids = findInvalidIdsTwo(sampleInput);
      expect(testInvalids).toEqual(sampleInvalids);
      const testSum = sumInvalids(testInvalids);
      expect(testSum).toEqual(sampleSum);
    });
  });
}
