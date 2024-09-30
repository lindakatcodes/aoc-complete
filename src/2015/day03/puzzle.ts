import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2015/day03/input.txt")) || "";

// known variables
const Directions = {
  north: "^",
  south: "v",
  east: ">",
  west: "<",
};

// functions
function moveToNextHouse(currPos: string, dir: string): string {
  let [x, y] = currPos.split(",").map((point) => Number(point));
  switch (dir) {
    case Directions["north"]:
      x += 1;
      break;
    case Directions["south"]:
      x -= 1;
      break;
    case Directions["east"]:
      y += 1;
      break;
    case Directions["west"]:
      y -= 1;
      break;
  }

  return `${x},${y}`;
}

function visitHouses(route: string): number {
  const stops = route.split("");
  // starts at 1 since he always delivers a present to the house he starts at
  let visitedCount = 1;
  const visitedPos = ["0,0"];
  let santaLocation = "0,0";

  stops.map((direction) => {
    santaLocation = moveToNextHouse(santaLocation, direction);
    if (!visitedPos.includes(santaLocation)) {
      visitedCount += 1;
      visitedPos.push(santaLocation);
    }
  });

  return visitedCount;
}

function visitHousesWithRoboSanta(route: string): number {
  const stops = route.split("");
  let visitedCount = 1;
  const housesVisited = ["0,0"];
  let santaLocation = "0,0";
  let roboLocation = "0,0";
  let santasTurn = true;

  stops.map((direction) => {
    if (santasTurn) {
      santaLocation = moveToNextHouse(santaLocation, direction);

      if (!housesVisited.includes(santaLocation)) {
        visitedCount += 1;
        housesVisited.push(santaLocation);
      }
      santasTurn = false;
    } else {
      roboLocation = moveToNextHouse(roboLocation, direction);

      if (!housesVisited.includes(roboLocation)) {
        visitedCount += 1;
        housesVisited.push(roboLocation);
      }
      santasTurn = true;
    }
  });

  return visitedCount;
}

// part 1 logic
const housesVisited = visitHouses(initData);
console.log({ part1: housesVisited });

// part 2 logic
const housesVisitedWithRoboSanta = visitHousesWithRoboSanta(initData);
console.log({ part2: housesVisitedWithRoboSanta });

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("part 1 test cases", () => {
    const sampleInput = [">", "^>v<", "^v^v^v^v^v"];
    const sampleAnswers = [2, 4, 2];

    it("correctly tells how many houses got presents", () => {
      sampleInput.forEach((route, index) => {
        const housesVisited = visitHouses(route);
        expect(housesVisited).toEqual(sampleAnswers[index]);
      });
    });
  });

  describe("part 2 test cases", () => {
    const sampleInput = ["^v", "^>v<", "^v^v^v^v^v"];
    const sampleAnswers = [3, 3, 11];

    it("counts unique houses with robosanta involved", () => {
      sampleInput.forEach((route, index) => {
        const housesVisited = visitHousesWithRoboSanta(route);
        expect(housesVisited).toEqual(sampleAnswers[index]);
      });
    });
  });
}
