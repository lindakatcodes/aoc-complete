import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2025/day08/input.txt")) as string;

// known variables
interface Distance {
  pointA: string;
  pointB: string;
  distance: number;
}

const coords = h.splitNewLines(initData).map((line) => {
  return line.split(",").map((val) => Number(val));
});

// functions
class UnionFind {
  parent: Record<string, string> = {};

  // adds the initial box into the parent object, connected to itself
  makeSet(id: string) {
    if (!(id in this.parent)) {
      this.parent[id] = id;
    }
  }

  // recursive function to find the ultimate root of a box; if the current parent id doesn't match the id we're looking for, we look again based on the connected boxes id until we find our match
  find(id: string): string {
    if (this.parent[id] !== id) {
      this.parent[id] = this.find(this.parent[id]);
    }
    return this.parent[id];
  }

  // joins two boxes by finding their root values; if they're the same they're already connected so we skip, otherwise b gets set to a
  union(idA: string, idB: string): boolean {
    const rootA = this.find(idA);
    const rootB = this.find(idB);

    // already connected state
    if (rootA === rootB) return false;

    // not connected state
    this.parent[rootB] = rootA;
    return true;
  }
}

// make all the distance connections and store those in a sorted list
function calcDistances(input: number[][]) {
  const distances: Distance[] = [];

  // a little more convoluted than it needs to be, but ends up slightly easier to see how the logic works of getting the difference of each coord group, squaring them, then finding the square root of all three added together
  for (let i = 0; i < input.length; i++) {
    if (i + 1 === input.length) break;
    const pointA = input[i];
    const restPoints = input.slice(i + 1);
    restPoints.forEach((point) => {
      const xdiff = Math.abs(pointA[0] - point[0]);
      const ydiff = Math.abs(pointA[1] - point[1]);
      const zdiff = Math.abs(pointA[2] - point[2]);
      const sqsum =
        Math.pow(xdiff, 2) + Math.pow(ydiff, 2) + Math.pow(zdiff, 2);
      const dist = Math.floor(Math.sqrt(sqsum));
      distances.push({
        pointA: pointA.join(","),
        pointB: point.join(","),
        distance: dist,
      });
    });
  }

  return distances.sort((a, b) => a.distance - b.distance);
}

function buildCircuitPaths(input: number[][], connectionCount: number) {
  // this is an object that holds all of our boxes with their joined coords as their id, and shows which box they're connected to
  const uf = new UnionFind();

  // initialize all the boxes
  input.forEach((box) => {
    uf.makeSet(box.join(","));
  });

  const distances: Distance[] = calcDistances(input);

  // make connections for however long we need to
  for (let i = 0; i < connectionCount; i++) {
    // this then joins the two boxes from our current distance grouping
    uf.union(distances[i].pointA, distances[i].pointB);
  }

  // then count how big the circuits are and sort them
  const circuitSizes: Record<string, number> = {};
  Object.keys(uf.parent).forEach((boxId) => {
    // this ends up being the parent for each box (it's value) which we then count
    const root = uf.find(boxId);
    circuitSizes[root] = (circuitSizes[root] || 0) + 1;
  });

  const circuitLengths = Object.values(circuitSizes).sort((a, b) => b - a);
  return circuitLengths;
}

function buildAllCircuitPaths(input: number[][]) {
  const uf = new UnionFind();

  input.forEach((box) => {
    uf.makeSet(box.join(","));
  });

  const distances: Distance[] = calcDistances(input);

  let lastConnected: Distance = { pointA: "", pointB: "", distance: 0 };

  for (let i = 0; i < distances.length; i++) {
    uf.union(distances[i].pointA, distances[i].pointB);

    const circuitSizes: Record<string, number> = {};
    Object.keys(uf.parent).forEach((boxId) => {
      const root = uf.find(boxId);
      circuitSizes[root] = (circuitSizes[root] || 0) + 1;
    });
    const circuitCount = Object.keys(circuitSizes);
    lastConnected = distances[i];
    if (circuitCount.length === 1) {
      break;
    }
  }

  return [
    lastConnected.pointA.split(",").map((val) => Number(val)),
    lastConnected.pointB.split(",").map((val) => Number(val)),
  ];
}

function calcTopProduct(lengths: number[]) {
  return lengths[0] * lengths[1] * lengths[2];
}

function calcXProduct(coordPair: number[][]) {
  return coordPair[0][0] * coordPair[1][0];
}

// part 1 logic
const connectsToMake = 1000;
const circuitsOne = buildCircuitPaths(coords, connectsToMake);
const circuitProdOne = calcTopProduct(circuitsOne);
console.log(`part 1: ${circuitProdOne}`);

// part 2 logic
const circuitsTwo = buildAllCircuitPaths(coords);
const xProduct = calcXProduct(circuitsTwo);
console.log(`part 2: ${xProduct}`);

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("part 1 test cases", () => {
    const sampleInput = [
      [162, 817, 812],
      [57, 618, 57],
      [906, 360, 560],
      [592, 479, 940],
      [352, 342, 300],
      [466, 668, 158],
      [542, 29, 236],
      [431, 825, 988],
      [739, 650, 466],
      [52, 470, 668],
      [216, 146, 977],
      [819, 987, 18],
      [117, 168, 530],
      [805, 96, 715],
      [346, 949, 466],
      [970, 615, 88],
      [941, 993, 340],
      [862, 61, 35],
      [984, 92, 344],
      [425, 690, 689],
    ];
    const sampleCircuits = [5, 4, 2, 2, 1, 1, 1, 1, 1, 1, 1];
    const sampleConnections = 10;
    const sampleThreeProduct = 40;

    it("solves part 1", () => {
      const testCircuits = buildCircuitPaths(sampleInput, sampleConnections);
      expect(testCircuits).toEqual(sampleCircuits);
      const testProduct = calcTopProduct(sampleCircuits);
      expect(testProduct).toEqual(sampleThreeProduct);
    });
  });

  describe("part 2 test cases", () => {
    const sampleInput = [
      [162, 817, 812],
      [57, 618, 57],
      [906, 360, 560],
      [592, 479, 940],
      [352, 342, 300],
      [466, 668, 158],
      [542, 29, 236],
      [431, 825, 988],
      [739, 650, 466],
      [52, 470, 668],
      [216, 146, 977],
      [819, 987, 18],
      [117, 168, 530],
      [805, 96, 715],
      [346, 949, 466],
      [970, 615, 88],
      [941, 993, 340],
      [862, 61, 35],
      [984, 92, 344],
      [425, 690, 689],
    ];
    const sampleLastPair = [
      [216, 146, 977],
      [117, 168, 530],
    ];
    const sampleXProd = 25272;

    it("solves part 2", () => {
      const testCircuitEnd = buildAllCircuitPaths(sampleInput);
      expect(testCircuitEnd).toEqual(sampleLastPair);
      const testXProduct = calcXProduct(testCircuitEnd);
      expect(testXProduct).toEqual(sampleXProd);
    });
  });
}
