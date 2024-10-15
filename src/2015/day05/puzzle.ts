import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2015/day05/input.txt")) as string;

// known variables
const vowels = /(?:[aeiou].*){3,}/i;
const strArray = initData.split("\n");

// functions

// string does not contain one of these "bad" combinations
function hasBadMatch(str: string) {
  const badCombos = ["ab", "cd", "pq", "xy"];
  return badCombos.some((combo) => str.includes(combo));
}

// string has at least one letter that appears twice in a row
function hasDoubleLetters(str: string) {
  let foundMatch = false;
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === str.charAt(i + 1)) {
      foundMatch = true;
      break;
    }
  }
  return foundMatch;
}

function isNiceString(str: string): boolean {
  let criteria = 0;

  /*
  criteria needs to be 3 things:
  - does not have one of the bad combo strings
  - 3+ vowels
  - 1+ set of repeated letters xx
  */

  // check for the bad combos first since that's automatic disqualification
  if (hasBadMatch(str)) {
    return false;
  } else {
    criteria += 1;
  }

  if (vowels.test(str)) {
    criteria += 1;
  }

  if (hasDoubleLetters(str)) {
    criteria += 1;
  }

  return criteria === 3 ? true : false;
}

// string has a pair of two letters that appears at least twice without overlapping with itself
function hasPairs(str: string) {
  const splitStr = str.split("");
  let result = false;

  for (let i = 0; i < splitStr.length; i++) {
    const pair = splitStr[i] + splitStr[i + 1];
    const hasOptions = str.includes(pair, i + 2);
    if (hasOptions) {
      result = true;
      break;
    }
  }

  return result;
}

// string has one letter that repeats with exactly one letter in between
function hasLetterRepeat(str: string) {
  const splitStr = str.split("");
  let result = false;

  for (let i = 0; i < splitStr.length; i++) {
    if (i + 2 < splitStr.length - 1) {
      if (splitStr[i] === splitStr[i + 2]) {
        result = true;
        break;
      }
    }
  }
  return result;
}

function isNiceString2(str: string): boolean {
  /* new criteria:
  - pair of any two letters that appears at least twice in the string without overlapping
  - at least one letter which repeats with exactly one letter between them
  */

  return hasPairs(str) && hasLetterRepeat(str) ? true : false;
}

// part 1 logic
const testStrings: number[] = strArray.map((str) =>
  isNiceString(str) ? 1 : 0
);
const niceStrings = testStrings.reduce((a, b) => {
  return a + b;
}, 0);
console.log({ part1: niceStrings });

// part 2 logic
const newTestStrings: number[] = strArray.map((str) =>
  isNiceString2(str) ? 1 : 0
);
const newNiceStrings = newTestStrings.reduce((a, b) => {
  return a + b;
}, 0);
console.log({ part2: newNiceStrings });

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("part 1 test cases", () => {
    const sampleInput = [
      "ugknbfddgicrmopn",
      "aaa",
      "jchzalrnumimnmhp",
      "haegwjzuvuyypxyu",
      "dvszwmarrgswjxmb",
    ];
    const sampleAnswers = [true, true, false, false, false];

    it("finds nice strings based on part 1 rules", () => {
      sampleInput.forEach((str, idx) => {
        const test = isNiceString(str);
        expect(test).toEqual(sampleAnswers[idx]);
      });
    });
  });

  describe("part 2 test cases", () => {
    const sampleInput = [
      "qjhvhtzxzqqjkmpb",
      "xxyxx",
      "uurcxstgmygtbstg",
      "ieodomkazucvgmuy",
    ];
    const sampleAnswers = [true, true, false, false];

    it("finds nice strings based on part 2 rules", () => {
      sampleInput.forEach((str, idx) => {
        const test = isNiceString2(str);
        expect(test).toEqual(sampleAnswers[idx]);
      });
    });
  });
}
