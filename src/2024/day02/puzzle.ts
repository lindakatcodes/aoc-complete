import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2024/day02/input.txt")) as string;

// known variables
const parsedData = h.splitNewLines(initData).map((row) => {
  return row.split(" ").map((item) => Number(item));
});

// functions
function countSafeReports(results: boolean[]) {
  return results.filter((result) => !!result).length;
}

function isOrdered(report: number[]) {
  const incRep = [...report].toSorted((a, b) => a - b);
  const decRep = [...incRep].toReversed();

  const isIncreasing = report.every((level, index) => level === incRep[index]);
  const isDecreasing = report.every((level, index) => level === decRep[index]);
  return isIncreasing || isDecreasing ? true : false;
}

function isPDOrdered(report: number[]) {
  // can remove 1 incorrect item and check again
  for (let i = 0; i < report.length; i++) {
    const modifiedReport = [...report.slice(0, i), ...report.slice(i + 1)];
    const modifiedIncRep = [...modifiedReport].toSorted((a, b) => a - b);
    const modifiedDecRep = [...modifiedIncRep].toReversed();

    const isIncreasing = modifiedReport.every(
      (level, index) => level === modifiedIncRep[index]
    );
    const isDecreasing = modifiedReport.every(
      (level, index) => level === modifiedDecRep[index]
    );

    if (isIncreasing || isDecreasing) {
      return true;
    }
  }

  return false;
}

function isNearby(report: number[]) {
  const dists = [];

  for (let i = 0; i < report.length - 1; i++) {
    const dist = Math.abs(report[i] - report[i + 1]);
    dists.push(dist);
  }

  const hasSmallIntervals = dists.every((val) => val >= 1 && val <= 3);

  return hasSmallIntervals ? true : false;
}

function isPDNearby(report: number[]) {
  // Try removing each number one at a time and check if the remaining sequence is valid
  for (let i = 0; i < report.length; i++) {
    const modifiedReport = [...report.slice(0, i), ...report.slice(i + 1)];
    if (isNearby(modifiedReport)) {
      return true;
    }
  }
  return false;
}

function checkReportSafety(report: number[]) {
  // reports are safe if all numbers inc or dec, and only by 1-3 points
  const goesOneDirection = isOrdered(report);
  const hasSmallDistances = isNearby(report);

  return goesOneDirection && hasSmallDistances ? true : false;
}

function checkReportSafetyWithPD(report: number[]) {
  // First check if it's already safe without PD
  if (checkReportSafety(report)) {
    return true;
  }

  // Try removing each number one at a time
  for (let i = 0; i < report.length; i++) {
    const modifiedReport = [...report.slice(0, i), ...report.slice(i + 1)];
    if (isOrdered(modifiedReport) && isNearby(modifiedReport)) {
      return true;
    }
  }

  return false;
}

// part 1 logic
let validReports = 0;
parsedData.forEach((report) => {
  const isSafe = checkReportSafety(report);
  if (isSafe) validReports++;
});
console.log({ part1: validReports });

// part 2 logic
let validReportsWithPD = 0;
parsedData.forEach((report) => {
  const isSafe = checkReportSafetyWithPD(report);
  if (isSafe) validReportsWithPD++;
});
console.log({ part2: validReportsWithPD });

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  const sampleInput = [
    [7, 6, 4, 2, 1],
    [1, 2, 7, 8, 9],
    [9, 7, 6, 2, 1],
    [1, 3, 2, 4, 5],
    [8, 6, 4, 4, 1],
    [1, 3, 6, 7, 9],
  ];

  const sample2 = [
    [75, 77, 72, 70, 69],
    [28, 28, 27, 26, 23],
    [20, 16, 14, 12, 10, 8, 7, 6],
    [74, 70, 71, 70, 68, 65],
    [44, 37, 34, 31, 30],
    [52, 47, 49, 46, 43, 41, 40],
  ];

  describe("part 1 test cases", () => {
    const sampleSafetyChecks = [true, false, false, false, false, true];
    const sampleSafeCount = 2;

    it("can tell if a report is safe or unsafe", () => {
      const testReportChecks = sampleInput.map((report) => {
        return checkReportSafety(report);
      });

      expect(testReportChecks).toEqual(sampleSafetyChecks);

      const testSafeCount = countSafeReports(sampleSafetyChecks);
      expect(testSafeCount).toEqual(sampleSafeCount);
    });
  });

  describe("part 2 test cases", () => {
    const sampleSafetyChecks = [true, false, false, true, true, true];
    const sampleSafeCount = 4;
    const sample2Checks = [true, true, true, true, true, true];
    const sample2Count = 6;

    it("can test report safety with the problem dampener", () => {
      const testReportChecks = sampleInput.map((report) => {
        return checkReportSafetyWithPD(report);
      });

      expect(testReportChecks).toEqual(sampleSafetyChecks);

      const testSafeCount = countSafeReports(sampleSafetyChecks);
      expect(testSafeCount).toEqual(sampleSafeCount);
    });

    it("gets the correct results with the second sample data", () => {
      const testReportChecks = sample2.map((report) => {
        return checkReportSafetyWithPD(report);
      });

      expect(testReportChecks).toEqual(sample2Checks);

      const testSafeCount = countSafeReports(sample2Checks);
      expect(testSafeCount).toEqual(sample2Count);
    });
  });
}
