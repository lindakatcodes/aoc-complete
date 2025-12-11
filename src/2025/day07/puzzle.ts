import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2025/day07/input.txt")) as string;

// known variables
const manifold = h.splitNewLines(initData);

// functions
function traceBeams(starterMap: string[]): number {
  let beamLocations: Set<number> = new Set();
  let splitCount = 0;

  for (let row = 0; row < starterMap.length; row++) {
    if (row === 0) {
      const startIndex = starterMap[row]
        .split("")
        .findIndex((val) => val === "S");
      if (!startIndex) break;
      beamLocations.add(startIndex);
    } else {
      // beams will only change if there's splitters in the row, so find those first
      if (starterMap[row].includes("^")) {
        const splitRow = starterMap[row].split("");

        // find the columns that have a splitter
        const splitterIndexes = splitRow
          .map((val, i) => val === "^" && i)
          .filter((val) => val !== false);

        // see which existing beams don't hit a splitter, so they keep going
        const remainingBeams = Array.from(beamLocations).filter(
          (loc) => !splitterIndexes.includes(loc)
        );

        // now need to note which splitters actually have a beam above them - those are the only ones we want to create new beams (and can increase the count for each of those too)
        const activeSplitters = splitterIndexes.filter((split) =>
          beamLocations.has(split)
        );
        splitCount += activeSplitters.length;

        // any splitters left should start a new beam to it's left and right
        activeSplitters.forEach((index) => {
          index - 1 >= 0 && remainingBeams.push(index - 1);
          index + 1 <= starterMap[row].length && remainingBeams.push(index + 1);
        });
        beamLocations = new Set(remainingBeams);
      }
    }
  }

  return splitCount;
}

function traceQuantumBeams(starterMap: string[]): number {
  let activeTimelines: Map<number, number> = new Map();

  for (let r = 0; r < starterMap.length; r++) {
    if (r === 0) {
      const startIndex = starterMap[r]
        .split("")
        .findIndex((val) => val === "S");
      activeTimelines.set(startIndex, 1);
    } else {
      if (starterMap[r].includes("^")) {
        const splitRow = starterMap[r].split("");

        // find the columns that have a splitter
        const splitterIndexes = splitRow
          .map((val, i) => val === "^" && i)
          .filter((val) => val !== false);

        // we need to store the next state in a temp variable, so we don't mess with the previous state
        const nextActiveTimeline: Map<number, number> = new Map();
        // loop over the active map, and for each index see if there's a splitter there
        Array.from(activeTimelines).forEach((beam) => {
          const left = beam[0] - 1;
          const right = beam[0] + 1;

          const hitsSplitter = splitterIndexes.includes(beam[0]);
          // if there is, the current value for that timeline gets added to whatever value is at the left and right indexes
          if (hitsSplitter) {
            if (left >= 0) {
              const leftValue = nextActiveTimeline.get(left) ?? 0;
              const newLeft = leftValue + beam[1];
              nextActiveTimeline.set(left, newLeft);
            }
            if (right < splitRow.length) {
              const rightValue = nextActiveTimeline.get(right) ?? 0;
              const newRight = rightValue + beam[1];
              nextActiveTimeline.set(right, newRight);
            }
          } else {
            // this beam keeps going, so we need to add it to our next state - but we want to append it, not overwrite it
            const currValue = nextActiveTimeline.get(beam[0]) ?? 0;
            nextActiveTimeline.set(beam[0], currValue + beam[1]);
          }
        });

        // then we update our state for the next pass through
        activeTimelines = nextActiveTimeline;
      }
    }
  }

  const timelineCount = h.sumNumberArray(
    Array.from(activeTimelines).map((col) => col[1])
  );
  return timelineCount;
}

// part 1 logic
const splitCountOne = traceBeams(manifold);
console.log(`part 1: ${splitCountOne}`);

// part 2 logic
const timelineCountTwo = traceQuantumBeams(manifold);
console.log(`part 2: ${timelineCountTwo}`);

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("part 1 test cases", () => {
    const sampleInput = [
      ".......S.......",
      "...............",
      ".......^.......",
      "...............",
      "......^.^......",
      "...............",
      ".....^.^.^.....",
      "...............",
      "....^.^...^....",
      "...............",
      "...^.^...^.^...",
      "...............",
      "..^...^.....^..",
      "...............",
      ".^.^.^.^.^...^.",
      "...............",
    ];
    const sampleSplits = 21;

    it("traces the beams and counts the number of splits in part 1", () => {
      const testTrace = traceBeams(sampleInput);
      expect(testTrace).toEqual(sampleSplits);
    });
  });

  describe("part 2 test cases", () => {
    const sampleInput = [
      ".......S.......",
      "...............",
      ".......^.......",
      "...............",
      "......^.^......",
      "...............",
      ".....^.^.^.....",
      "...............",
      "....^.^...^....",
      "...............",
      "...^.^...^.^...",
      "...............",
      "..^...^.....^..",
      "...............",
      ".^.^.^.^.^...^.",
      "...............",
    ];
    const sampleTimelines = 40;

    it("finds all the timelines in part 2", () => {
      const testTrace = traceQuantumBeams(sampleInput);
      expect(testTrace).toEqual(sampleTimelines);
    });
  });
}
