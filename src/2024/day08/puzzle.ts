import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2024/day08/input.txt")) as string;

// known variables

// functions
function findAntinodes(map: string[]) {
  const splitMap = map.map((row) => row.split(""));
  const locations: { [key: string]: Array<number[]> } = {};

  splitMap.forEach((row, rowId) => {
    // go over each row, and whenever we find something that's not a . we do stuff
    for (let i = 0; i < row.length; i++) {
      if (row[i] === ".") continue;

      if (locations.hasOwnProperty(row[i])) {
        locations[row[i]].push([rowId, i]);
      } else {
        locations[row[i]] = [[rowId, i]];
      }
    }
  });

  const antinodes = new Set();
  const frequencies = Object.values(locations);

  frequencies.forEach((freq) => {
    for (let i = 0; i < freq.length; i++) {
      const location = freq[i].map((val) => Number(val));
      const others = freq.toSpliced(i, 1);
      // console.log({ location, others });
      others.map((val) => {
        const rowDiff = Math.abs(location[0] - Number(val[0]));
        const colDiff = Math.abs(location[1] - Number(val[1]));
        // the nodes are double away from the other locations
        const antiRow =
          location[0] < Number(val[0])
            ? location[0] + rowDiff * 2
            : location[0] - rowDiff * 2;
        const antiCol =
          location[1] < Number(val[1])
            ? location[1] + colDiff * 2
            : location[1] - colDiff * 2;
        // console.log({ antiRow, antiCol });

        if (
          h.isInBounds(antiRow, antiCol, splitMap.length, splitMap[0].length)
        ) {
          antinodes.add(`${antiRow}, ${antiCol}`);
        }
      });
    }
  });

  return antinodes;
}

// part 1 logic
const splitData = h.splitNewLines(initData);
const antinodeSpots = findAntinodes(splitData);
console.log({ part1: antinodeSpots.size });

// part 2 logic

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("part 1 test cases", () => {
    const sampleInput = [
      "............",
      "........0...",
      ".....0......",
      ".......0....",
      "....0.......",
      "......A.....",
      "............",
      "............",
      "........A...",
      ".........A..",
      "............",
      "............",
    ];
    const sampleAntinodes = 14;

    it("finds the right number of antinodes", () => {
      const testAntinodes = findAntinodes(sampleInput);
      expect(testAntinodes.size).toEqual(sampleAntinodes);
    });
  });

  describe.todo("part 2 test cases", () => {
    const sampleInput = [];
    const sampleAnswers = [];

    it("", () => {});
  });
}
