import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2024/day01/input.txt")) as string;

// known variables
const initSplitData = h.splitNewLines(initData);
const [leftLocList, rightLocList] = splitLists(initSplitData);

// functions
function splitLists(combinedList: string[]) {
  const left: number[] = [];
  const right: number[] = [];

  combinedList.forEach((row) => {
    const [first, second] = row.split(/\s+/);
    left.push(Number(first));
    right.push(Number(second));
  });

  return [left, right];
}

function sortList(list: number[]) {
  const listCopy = [...list];
  return listCopy.sort((a, b) => a - b);
}

function calcDistances(left: number[], right: number[]) {
  const results: number[] = [];
  const leftSorted = sortList(left);
  const rightSorted = sortList(right);

  for (let i = 0; i < leftSorted.length; i++) {
    const dist = Math.abs(leftSorted[i] - rightSorted[i]);
    results.push(dist);
  }

  return results;
}

function calcSimilarities(left: number[], right: number[]) {
  const allSims: number[] = [];
  left.forEach((id) => {
    const rightCount = right.filter((num) => num === id).length;
    const simScore = id * rightCount;
    allSims.push(simScore);
  });

  return allSims;
}

// part 1 logic
const allDists = calcDistances(leftLocList, rightLocList);
const totalDist = h.sumNumberArray(allDists);
console.log({ part1: totalDist });

// part 2 logic
const allSims = calcSimilarities(leftLocList, rightLocList);
const totalSimScore = h.sumNumberArray(allSims);
console.log({ part2: totalSimScore });

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const sampleInitInput = [
    "3   4",
    "4   3",
    "2   5",
    "1   3",
    "3   9",
    "3   3",
  ];
  const leftList = [3, 4, 2, 1, 3, 3];
  const rightList = [4, 3, 5, 3, 9, 3];

  describe("part 1 test cases", () => {
    const sampleDistances = [2, 1, 0, 1, 2, 5];
    const sampleTotal = 11;

    it("can split the input into left and right lists", () => {
      const testSplitResults = splitLists(sampleInitInput);
      expect(testSplitResults[0]).toEqual(leftList);
      expect(testSplitResults[1]).toEqual(rightList);
    });

    it("correctly finds the pair distances and total length", () => {
      const testDistances = calcDistances(leftList, rightList);
      expect(testDistances).toEqual(sampleDistances);
      const testTotal = h.sumNumberArray(sampleDistances);
      expect(testTotal).toEqual(sampleTotal);
    });
  });

  describe("part 2 test cases", () => {
    const sampleSims = [9, 4, 0, 0, 9, 9];
    const sampleTotalSim = 31;

    it("correctly finds the similarity scores", () => {
      const testAllSims = calcSimilarities(leftList, rightList);
      expect(testAllSims).toEqual(sampleSims);
      const testTotalScore = h.sumNumberArray(sampleSims);
      expect(testTotalScore).toEqual(sampleTotalSim);
    });
  });
}
