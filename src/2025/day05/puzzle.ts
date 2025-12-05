import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2025/day05/input.txt")) as string;

// known variables
const splitData = h.splitNewLines(initData);
const [ranges, itemList] = parseInput(splitData);

// functions
function parseInput(strArr: string[]): [ranges: string[], items: number[]] {
  const ranges: string[] = [];
  const items: number[] = [];

  strArr.forEach((val) => {
    if (val.includes("-")) {
      ranges.push(val);
    } else if (val !== "") {
      items.push(Number(val));
    }
  });
  return [ranges, items];
}

function countFreshIngredients(ranges: string[], items: number[]): number {
  let freshCount = 0;

  items.forEach((item) => {
    let itemFound = false;

    ranges.forEach((range) => {
      if (itemFound) return;
      const rangeEdges = range.split("-");
      const start = parseInt(rangeEdges[0]);
      const end = parseInt(rangeEdges[1]);

      if (item >= start && item <= end) {
        freshCount++;
        itemFound = true;
      }
    });
  });
  return freshCount;
}

function countTotalFreshValues(ranges: string[]): number {
  let totalCount = 0;
  const allRanges: number[][] = [];

  // turn all the ranges into arrays of their start and end numbers
  ranges.forEach((range) => {
    const rangeEdges = range.split("-");
    const start = parseInt(rangeEdges[0]);
    const end = parseInt(rangeEdges[1]);

    allRanges.push([start, end]);
  });

  // then sort the arrays so that they're in the order they'd appear if they were all one big list
  const sortedRanges = allRanges.toSorted((first, second) => {
    if (first[0] < second[0]) {
      return -1;
    } else if (first[0] > second[0]) {
      return 1;
    } else {
      return 0;
    }
  });

  // then we need to go over the sorted ranges and merge any that overlap so we end up with an array of ranges that don't touch each other
  const mergedRanges: number[][] = [];

  sortedRanges.forEach((range, index) => {
    if (index === 0) {
      mergedRanges.push(range);
    } else {
      if (range[0] <= mergedRanges[mergedRanges.length - 1][1]) {
        // this needs to merge - make sure we pick the new smallest and new largest values
        const currVersion = mergedRanges.pop()!;
        const newStart = currVersion[0] < range[0] ? currVersion[0] : range[0];
        const newEnd = currVersion[1] > range[1] ? currVersion[1] : range[1];
        const newVersion = [newStart, newEnd];
        mergedRanges.push(newVersion);
      } else {
        // no overlap so can start a new range
        mergedRanges.push(range);
      }
    }
  });

  // last we go over our merged ranges and count the length of each range and that's our total count
  mergedRanges.forEach((range) => {
    // adding 1 since we need to be inclusive of the first value too (5 - 3 is 2 but we have 3 values)
    const rangeLen = range[1] - range[0] + 1;
    totalCount += rangeLen;
  });

  return totalCount;
}

// part 1 logic
const oneFreshCount = countFreshIngredients(ranges, itemList);
console.log(`part 1: ${oneFreshCount}`);

// part 2 logic
const totalFreshCount = countTotalFreshValues(ranges);
console.log(`part 2: ${totalFreshCount}`);

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("part 1 test cases", () => {
    const sampleInput = [
      "3-5",
      "10-14",
      "16-20",
      "12-18",
      "",
      "1",
      "5",
      "8",
      "11",
      "17",
      "32",
    ];
    const sampleRanges = ["3-5", "10-14", "16-20", "12-18"];

    const sampleIngredients = [1, 5, 8, 11, 17, 32];

    const sampleFresh = 3;

    it("parses the input and solves part 1", () => {
      const [testRanges, testIngredients] = parseInput(sampleInput);
      expect(testRanges).toEqual(sampleRanges);
      expect(testIngredients).toEqual(sampleIngredients);

      const testFreshCount = countFreshIngredients(
        sampleRanges,
        sampleIngredients
      );
      expect(testFreshCount).toEqual(sampleFresh);
    });
  });

  describe("part 2 test cases", () => {
    const sampleRanges = ["3-5", "10-14", "16-20", "12-18"];
    const sampleTotalCount = 14;

    it("solves part 2", () => {
      const testCount = countTotalFreshValues(sampleRanges);
      expect(testCount).toEqual(sampleTotalCount);
    });
  });
}
