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
    direction.filter((val) => val === "inc").length === direction.length - 1;

  const isFullDecrease = direction.every((val) => val === "dec");
  const isDampenedDecrease =
    direction.filter((val) => val === "dec").length === direction.length - 1;

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
      // valToRemove is actually showing the relationship between that index and the next value. so how i'm getting the adjusted report isn't right. need to figure out of the two numbers involved, which to keep

      adjustedReport = [
        ...report.slice(0, valToRemove + 1),
        ...report.slice(valToRemove + 2),
      ];
    }

    for (let i = 0; i < adjustedReport.length - 1; i++) {
      const dist = Math.abs(adjustedReport[i] - adjustedReport[i + 1]);
      intervals.push(dist);
    }
  }

  const hasSmallIntervals = intervals.every((val) => val >= 1 && val <= 3);

  let hasDampenedIntervals = false;

  if (!hasSmallIntervals) {
    // can I take the first val off and get it to pass?
    const withoutFirst = intervals.slice(1);
    // what about the last one?
    const withoutLast = intervals.slice(0, intervals.length - 1);

    const firstWorks = withoutFirst.every((val) => val >= 1 && val <= 3);
    const lastWorks = withoutLast.every((val) => val >= 1 && val <= 3);
    if (firstWorks || lastWorks) {
      hasDampenedIntervals = true;
    }
  }

  if (
    (isFullIncrease && hasSmallIntervals) ||
    (isFullDecrease && hasSmallIntervals) ||
    (isDampenedIncrease && hasSmallIntervals) ||
    (isDampenedDecrease && hasSmallIntervals) ||
    (isFullIncrease && hasDampenedIntervals) ||
    (isFullDecrease && hasDampenedIntervals)
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
        return checkReportSafetyWithDampener(report);
      });

      expect(testReportChecks).toEqual(sampleSafetyChecks);

      const testSafeCount = countSafeReports(sampleSafetyChecks);
      expect(testSafeCount).toEqual(sampleSafeCount);
    });

    it("gets the correct results with the second sample data", () => {
      const testReportChecks = sample2.map((report) => {
        return checkReportSafetyWithDampener(report);
      });

      expect(testReportChecks).toEqual(sample2Checks);

      const testSafeCount = countSafeReports(sampleSafetyChecks);
      expect(testSafeCount).toEqual(sample2Count);
    });
  });
}
