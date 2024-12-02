import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2024/day02/input.txt")) as string;

// known variables
const parsedData = h.splitNewLines(initData).map((row) => {
  return row.split(" ").map((item) => Number(item));
});

// functions
function checkReportSafety(report: number[]) {
  // reports are safe if all numbers inc or dec, and only by 1-3 points
  const sortedCopy = [...report].toSorted((a, b) => a - b);
  const reverseSort = [...sortedCopy].reverse();

  const isIncreasing = report.every(
    (level, index) => level === sortedCopy[index]
  );
  const isDecreasing = report.every(
    (level, index) => level === reverseSort[index]
  );

  const intervals = [];

  if (isIncreasing || isDecreasing) {
    for (let i = 0; i < report.length - 1; i++) {
      const dist = Math.abs(report[i] - report[i + 1]);
      intervals.push(dist);
    }
  }

  const hasSmallIntervals = intervals.every((val) => val >= 1 && val <= 3);

  if (isIncreasing && hasSmallIntervals) {
    return true;
  } else if (isDecreasing && hasSmallIntervals) {
    return true;
  } else {
    return false;
  }
}

function countSafeReports(results: boolean[]) {
  return results.filter((result) => !!result).length;
}

function checkReportSafetyWithDampener(report: number[]) {
  const direction = [];
  for (let i = 0; i < report.length - 1; i++) {
    if (report[i] < report[i + 1]) {
      direction.push("inc");
    } else if (report[i] > report[i + 1]) {
      direction.push("dec");
    } else {
      direction.push("eq");
    }
  }

  const isFullIncrease = direction.every((val) => val === "inc");
  const isDampenedIncrease =
    direction.filter((val) => val === "inc").length === report.length - 2;

  const isFullDecrease = direction.every((val) => val === "dec");
  const isDampenedDecrease =
    direction.filter((val) => val === "dec").length === report.length - 2;

  const intervals = [];

  if (isFullIncrease || isFullDecrease) {
    for (let i = 0; i < report.length - 1; i++) {
      const dist = Math.abs(report[i] - report[i + 1]);
      intervals.push(dist);
    }
  }

  if (isDampenedIncrease || isDampenedDecrease) {
    let adjustedReport = [];

    if (isDampenedIncrease) {
      const valToRemove = direction.findIndex((val) => val !== "inc");
      adjustedReport = [
        ...report.slice(0, valToRemove),
        ...report.slice(valToRemove + 1),
      ];
    } else {
      const valToRemove = direction.findIndex((val) => val !== "dec");
      adjustedReport = [
        ...report.slice(0, valToRemove),
        ...report.slice(valToRemove + 1),
      ];
    }

    for (let i = 0; i < adjustedReport.length - 1; i++) {
      const dist = Math.abs(adjustedReport[i] - adjustedReport[i + 1]);
      intervals.push(dist);
    }
  }

  const hasSmallIntervals = intervals.every((val) => val >= 1 && val <= 3);

  if (
    (isFullIncrease && hasSmallIntervals) ||
    (isFullDecrease && hasSmallIntervals) ||
    (isDampenedIncrease && hasSmallIntervals) ||
    (isDampenedDecrease && hasSmallIntervals)
  ) {
    return true;
  } else {
    return false;
  }
}

// part 1 logic
let validReports = 0;
parsedData.forEach((report) => {
  const isSafe = checkReportSafety(report);
  if (isSafe) validReports++;
});
console.log({ part1: validReports });

// part 2 logic
let validReportsWithDampener = 0;
parsedData.forEach((report) => {
  const isSafe = checkReportSafetyWithDampener(report);
  if (isSafe) validReportsWithDampener++;
});
console.log({ part2: validReportsWithDampener });

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

    it("can test report safety with the problem dampener", () => {
      const testReportChecks = sampleInput.map((report) => {
        return checkReportSafetyWithDampener(report);
      });

      expect(testReportChecks).toEqual(sampleSafetyChecks);

      const testSafeCount = countSafeReports(sampleSafetyChecks);
      expect(testSafeCount).toEqual(sampleSafeCount);
    });
  });
}
