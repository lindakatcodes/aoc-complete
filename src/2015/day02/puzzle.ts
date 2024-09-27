import * as h from "../../utils/helpers.js";
const initData = await h.readData("./src/2015/day02/input.txt");

// known variables
const allPackages = initData!.split("\r\n").map((str) => {
  const dim = str.split("x").map((char) => Number(char));
  return dim;
});

// functions
function getPaperSize(present: number[]): number {
  const lw = present[0] * present[1];
  const wh = present[1] * present[2];
  const hl = present[2] * present[0];

  const sqft = 2 * lw + 2 * wh + 2 * hl;
  const shortest = Math.min(lw, wh, hl);

  // return full result
  return sqft + shortest;
}

function getWrapSize(present: number[]): number {
  const lwp = present[0] + present[0] + present[1] + present[1];
  const whp = present[1] + present[1] + present[2] + present[2];
  const hlp = present[2] + present[2] + present[0] + present[0];

  return Math.min(lwp, whp, hlp);
}

function getBowSize(present: number[]): number {
  return present[0] * present[1] * present[2];
}

// part 1 logic
const allDimensions = allPackages.map((present) => getPaperSize(present));
const totalSqft = h.sumNumberArray(allDimensions);
console.log({ part1: totalSqft });

// part 2 logic
const allRibbonLengths = allPackages.map((present) => {
  const perimeter = getWrapSize(present);
  const bow = getBowSize(present);
  return perimeter + bow;
});
const totalRibbon = h.sumNumberArray(allRibbonLengths);
console.log({ part2: totalRibbon });

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("part 1 test cases", () => {
    const sampleInput = [
      [2, 3, 4],
      [1, 1, 10],
    ];
    const sqftAnswer = [58, 43];
    let sampleResults = 0;
    const allPackagesAnswer = 101;

    it("correctly calculates the square feet of a package", () => {
      sampleInput.forEach((present, index) => {
        const sqftInitial = getPaperSize(present);
        expect(sqftInitial).toEqual(sqftAnswer[index]);
        sampleResults += sqftInitial;
      });
    });

    it("correctly returns the total square feet needed for all packages", () => {
      expect(sampleResults).toEqual(allPackagesAnswer);
    });
  });

  describe("part 2 test cases", () => {
    const sampleInput = [
      [2, 3, 4],
      [1, 1, 10],
    ];
    const wrapAnswer = [10, 4];
    const bowAnswer = [24, 10];
    let sampleAnswer = 0;
    const totalAnswer = 48;

    it("correctly calculates the ribbon needed to wrap and create bows", () => {
      sampleInput.forEach((present, index) => {
        const wrapSize = getWrapSize(present);
        expect(wrapSize).toEqual(wrapAnswer[index]);
        const bowSize = getBowSize(present);
        expect(bowSize).toEqual(bowAnswer[index]);
        sampleAnswer += wrapSize + bowSize;
      });
    });

    it("correctly returns the total ribbon feet needed for all packages", () => {
      expect(sampleAnswer).toEqual(totalAnswer);
    });
  });
}
