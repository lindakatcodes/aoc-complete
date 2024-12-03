import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2024/day03/input.txt")) as string;

// known variables
const validMult = /mul\(\d{1,3},\d{1,3}\)/g;
const validDo = /do\(\)/g;
const validDont = /don\'t\(\)/g;
const doLen = 4;
const dontLen = 7;

// functions
function cleanData(dirtyArr: string[]) {
  const cleanArr: number[][] = [];

  dirtyArr.forEach((item) => {
    const pair = item
      .slice(4, -1)
      .split(",")
      .map((val) => Number(val));
    cleanArr.push(pair);
  });

  return cleanArr;
}
function calcMultResults(allMults: string[]) {
  const startPairs = cleanData(allMults);
  const multResults = startPairs.map((pair) => pair[0] * pair[1]);

  return multResults;
}

function findEnabledInstructions(input: string) {
  // first find where the do and dont calls are
  const doMatches = [...input.matchAll(validDo)];
  const dontMatches = [...input.matchAll(validDont)];

  const doIndexes = [];
  const dontIndexes = [];

  for (const match of doMatches) {
    doIndexes.push(match.index);
  }

  for (const match of dontMatches) {
    dontIndexes.push(match.index);
  }

  // then setup to cycle through everything
  const validMatches = [];
  let startIndex = 0;
  let stopIndex = dontIndexes[0];
  let currDo = 0;
  let currDont = 1;
  let eos = false;

  do {
    const substr = input.slice(startIndex, stopIndex);
    const matches = substr.match(validMult) as string[];
    if (matches) {
      validMatches.push(...matches);
    }

    // no guarantee that do and dont always alternate - so find the next active ones
    const nextStartLookup = doIndexes.findIndex((val) => val > stopIndex);
    if (nextStartLookup === -1) {
      eos = true;
    }
    const nextStart = doIndexes[nextStartLookup] + doLen;
    startIndex = nextStart;
    currDo = nextStartLookup;

    const nextStopLookup = dontIndexes.findIndex((val) => val > startIndex);

    let nextStop = dontIndexes[nextStopLookup];
    if (nextStopLookup === -1 && stopIndex < input.length) {
      nextStop = input.length;
    } else if (nextStopLookup === -1) {
      eos = true;
    }
    stopIndex = nextStop;
    currDont = nextStopLookup;

    if (stopIndex > input.length || startIndex > input.length) {
      eos = true;
      break;
    }
  } while (!eos);

  return validMatches;
}

// part 1 logic
const validInstructions = initData.match(validMult) as string[];
const multResults = calcMultResults(validInstructions);
const multSum = h.sumNumberArray(multResults);
console.log({ part1: multSum });

// part 2 logic
const enabledInstructions = findEnabledInstructions(initData);
const enabledResults = calcMultResults(enabledInstructions);
const enabledSum = h.sumNumberArray(enabledResults);
console.log({ part1: enabledSum });

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("part 1 test cases", () => {
    const sampleInput =
      "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))";
    const sampleMults = [8, 25, 88, 40];
    const sampleSum = 161;

    it("finds all the correct instructions and returns the right sum", () => {
      const testMults = sampleInput.match(validMult) as string[];

      const testResults = calcMultResults(testMults);
      expect(testResults).toEqual(sampleMults);

      const testSum = h.sumNumberArray(testResults);
      expect(testSum).toEqual(sampleSum);
    });
  });

  describe("part 2 test cases", () => {
    const sampleInput =
      "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))";
    const sampleMults = [8, 40];
    const sampleSum = 48;

    it("finds all the correct instructions and returns the right sum", () => {
      const testMults = findEnabledInstructions(sampleInput);

      const testResults = calcMultResults(testMults);
      expect(testResults).toEqual(sampleMults);

      const testSum = h.sumNumberArray(testResults);
      expect(testSum).toEqual(sampleSum);
    });
  });
}
