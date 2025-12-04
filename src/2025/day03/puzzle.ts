import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2025/day03/input.txt")) as string;

// known variables
const bankList = h.splitNewLines(initData);

// functions
function getBankJoltsOne(input: string[]): number[] {
  const maxJoltList: number[] = [];

  for (const bank of input) {
    // thinking is - split the input into pieces, find the first highest value (from 0 index to len - 1, since the last number can't have a number after it), find the index of that number, then find the highest number after that index to get the next value
    const fullBank = bank.split("").map((val) => Number(val));

    const firstBatteries = fullBank.slice(0, fullBank.length - 1);
    const firstHighest = Math.max(...firstBatteries);
    const firstIndex = firstBatteries.findIndex((val) => val === firstHighest);

    const secondBatteries = fullBank.slice(firstIndex + 1);
    const secondHighest = Math.max(...secondBatteries);
    const secondIndex = secondBatteries.findIndex(
      (val) => val === secondHighest
    );

    const maxJolts = `${firstBatteries[firstIndex]}${secondBatteries[secondIndex]}`;
    maxJoltList.push(Number(maxJolts));
  }

  return maxJoltList;
}

function getBankJoltsTwo(input: string[]): number[] {
  const maxJoltList: number[] = [];

  // this is a greedy algorithm example. so what we do is split the digits into individual numbers, and have an empty max/result array we can add and remove to. we also need to know how many discards we have - since our goal is to make the biggest number, we really want to keep as much as we can and only discard what we really don't need, so that's what we track.
  for (const bank of input) {
    const fullBank = bank.split("").map((val) => Number(val));
    const max: number[] = [];
    let discardCount = fullBank.length - 12;

    for (let i = 0; i < fullBank.length; i++) {
      // if nothing's in our array we can simply add the current value
      if (max.length === 0) {
        max.push(fullBank[i]);
      } else {
        // otherwise, if it's the same or lower than what our last digit is, we can append it to the end
        if (fullBank[i] <= max[max.length - 1]) {
          max.push(fullBank[i]);
        } else if (fullBank[i] > max[max.length - 1]) {
          // this is the tricky part - if our new digit is higher than the last one, we want to loop while we still have discards available and it's still higher than the last digit we have stored. for the first go round this will be true, so we pop off the last stored digit and decrease our discard count. then it'll run again against the new last stored digit, and continue until we run out of discards (meaning we should now have the highest values we can left) or the current digit is no longer bigger than the last one stored
          while (discardCount > 0 && fullBank[i] > max[max.length - 1]) {
            max.pop();
            discardCount--;
          }
          // once we're out of discards or the new digit is <= to the last stored one, we add it and move on to the next digit
          max.push(fullBank[i]);
        }
      }
    }

    // we trim here because if we still had discards left (like lots of the same small number at the end), we might have a result value that's longer than we need. it should always be safe to simply trim it
    const jolt = Number(max.slice(0, 12).join(""));
    maxJoltList.push(jolt);
    // end of bank loop
  }

  return maxJoltList;
}

function calcSum(numArr: number[]): number {
  return h.sumNumberArray(numArr);
}

// part 1 logic
const bankJoltsList = getBankJoltsOne(bankList);
const joltSum = calcSum(bankJoltsList);
console.log("part 1: ", joltSum);

// part 2 logic
const twelveJoltBanks = getBankJoltsTwo(bankList);
const twelveJoltSum = calcSum(twelveJoltBanks);
console.log("part 2: ", twelveJoltSum);

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("part 1 test cases", () => {
    const sampleInput = [
      "987654321111111",
      "811111111111119",
      "234234234234278",
      "818181911112111",
    ];
    const sampleJolts = [98, 89, 78, 92];
    const sampleMax = 357;

    it("solves part 1", () => {
      const testJolts = getBankJoltsOne(sampleInput);
      expect(testJolts).toEqual(sampleJolts);
      const testSum = calcSum(testJolts);
      expect(testSum).toEqual(sampleMax);
    });
  });

  describe("part 2 test cases", () => {
    const sampleInput = [
      "987654321111111",
      "811111111111119",
      "234234234234278",
      "818181911112111",
    ];
    const sampleJolts = [
      987654321111, 811111111119, 434234234278, 888911112111,
    ];
    const sampleMax = 3121910778619;

    it("solves part 2", () => {
      const testJolts = getBankJoltsTwo(sampleInput);
      expect(testJolts).toEqual(sampleJolts);
      const testSum = calcSum(testJolts);
      expect(testSum).toEqual(sampleMax);
    });
  });
}
