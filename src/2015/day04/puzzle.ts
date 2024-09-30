import * as h from "../../utils/helpers.js";
import crypto from "node:crypto";

const initData = (await h.readData("./src/2015/day04/input.txt")) as string;

// known variables
const fiveZeroesRegex = /^00000/;
const sixZeroesRegex = /^000000/;

// functions
function findLowestHashWithLeadingZeroes(
  secret: string,
  regex: RegExp
): number {
  let num = 1;
  let foundMatch = false;

  do {
    const str = `${secret}${num}`;
    const hash = crypto.hash("md5", str);
    if (regex.test(hash)) {
      foundMatch = true;
      break;
    } else {
      num += 1;
    }
  } while (!foundMatch);

  return num;
}

// part 1 logic
console.time("part1");
const firstNum = findLowestHashWithLeadingZeroes(initData, fiveZeroesRegex);
console.log({ part1: firstNum });
console.timeEnd("part1");

// part 2 logic
console.time("part2");
const secondNum = findLowestHashWithLeadingZeroes(initData, sixZeroesRegex);
console.log({ part2: secondNum });
console.timeEnd("part2");

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("part 1 test cases", () => {
    const sampleInput = ["abcdef", "pqrstuv"];
    const sampleAnswers = [609043, 1048970];

    it("finds the lowest number hash with 5 starting zeroes", () => {
      sampleInput.forEach((secret, index) => {
        const answer = findLowestHashWithLeadingZeroes(secret, fiveZeroesRegex);
        expect(answer).toEqual(sampleAnswers[index]);
      });
    });
  });
}
