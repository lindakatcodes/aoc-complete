import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2015/day06/input.txt")) as string;

// known variables
const instructions = h.splitNewLines(initData);

// functions
function generateRange(str: string) {
  const [start, _, end] = str.split(" ");
  const [startX, startY] = start.split(",").map((char: string) => Number(char));
  const [endX, endY] = end.split(",").map((char: string) => Number(char));
  const range: string[] = [];

  for (let x = startX; x <= endX; x++) {
    for (let y = startY; y <= endY; y++) {
      range.push(`${x},${y}`);
    }
  }

  return range;
}

function parseInput(instr: string): [string, string[]] {
  const [_, mode, rangeStr] = instr.split(/(turn on|turn off|toggle)\s/);
  const range = generateRange(rangeStr);
  return [mode, range];
}

function runInstructions(
  mode: string,
  rangeToFlip: string[],
  lightArr: Set<string>
) {
  rangeToFlip.forEach((coord) => {
    if (mode === "turn on") {
      lightArr.add(coord);
    } else if (mode === "turn off") {
      lightArr.delete(coord);
    } else {
      lightArr.has(coord) ? lightArr.delete(coord) : lightArr.add(coord);
    }
  });
}

function runBrightnessInstructions(
  mode: string,
  rangeToParse: string[],
  allLights: Map<string, number>
) {
  rangeToParse.forEach((coord) => {
    const curr = allLights.get(coord) as number;

    if (mode === "turn on") {
      allLights.set(coord, curr + 1);
    } else if (mode === "turn off") {
      allLights.set(coord, curr !== 0 ? curr - 1 : 0);
    } else {
      allLights.set(coord, curr + 2);
    }
  });

  return allLights;
}

function getTotal(initMap: Map<string, number>) {
  let total = 0;

  for (const [_, value] of initMap) {
    total += value;
  }

  return total;
}

// part 1 logic
const p1LightsOn = new Set<string>([]);

console.time("run instructions p1");
instructions.forEach((step) => {
  const [nextMode, nextRange] = parseInput(step);
  runInstructions(nextMode, nextRange, p1LightsOn);
});
console.timeEnd("run instructions p1");

console.log({ part1: p1LightsOn.size });

// part 2 logic
const lightRange = generateRange("0,0 through 999,999");
const lightMap = new Map();
lightRange.forEach((coord) => lightMap.set(coord, 0));

console.time("run instructions p2");
instructions.forEach((step) => {
  const [mode2, range2] = parseInput(step);
  runBrightnessInstructions(mode2, range2, lightMap);
});
console.timeEnd("run instructions p2");

const totalBrightness = getTotal(lightMap);
console.log({ part2: totalBrightness });

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("part 1 test cases", () => {
    const sampleInput = [
      "turn on 0,0 through 3,3",
      "toggle 0,0 through 3,0",
      "turn off 1,1 through 1,2",
    ];
    const sampleAnswers = [16, 12, 10];

    it("correctly parses instructions and manages the lights", () => {
      const lightsOn = new Set<string>([]);

      sampleInput.forEach((step, index) => {
        const [mode, range] = parseInput(step);
        runInstructions(mode, range, lightsOn);
        expect(sampleAnswers[index]).toEqual(lightsOn.size);
      });
    });
  });

  describe("part 2 v2 test cases", () => {
    const sampleInput = [
      "turn on 0,0 through 3,3",
      "toggle 0,0 through 3,0",
      "turn off 1,1 through 1,2",
    ];
    const sampleAnswers = [16, 24, 22];

    it("correctly updates the brightness", () => {
      const sampleRange = generateRange("0,0 through 3,3");
      const sampleMap = new Map();
      sampleRange.forEach((coord) => sampleMap.set(coord, 0));

      sampleInput.forEach((step, index) => {
        const [mode, range] = parseInput(step);
        runBrightnessInstructions(mode, range, sampleMap);
        const testTotal = getTotal(sampleMap);
        expect(testTotal).toEqual(sampleAnswers[index]);
      });
    });
  });
}
