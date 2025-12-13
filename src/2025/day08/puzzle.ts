import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2025/day08/input.txt")) as string;

// known variables

// functions
// this needs to parse the input coords into nodes, each storing it's location and a parent connection that will start pointing to itself.
// it will also need to create a sorted array of all the potential pairs of coords and their distances, sorted with the shortest distances first
// it will then loop through the first X shortest distances, and connect the circuits. circuits are connected by setting them to the same parent connection (one that still points to itself)

/* test logic
const nodes = {
    nodeA: {
      coords: [162, 817, 812],
      children: [nodes.nodeB],
      root: null,
    },
    nodeB: {
      coords: [1, 2, 3],
      children: [],
      root: nodes.nodeB,
    },
    nodeC: {
      coords: [4, 5, 6],
      children: [nodes.nodeD, nodes.nodeE],
      root: null,
    },
    nodeD: {
      coords: [7, 8, 9],
      children: [],
      root: nodes.nodeC,
    },
    nodeE: {
      coords: [12, 13, 14],
      children: [],
      root: nodes.nodeC,
    },
  };

  // connect b and d - a is root
  nodeD.root();
  nodeC.children.forEach((child) => (child.root = nodeA));
  nodeA.children.push(...nodeC.children);
  nodeC.children = [];
  nodeC.root = nodeA;
 */
function buildCircuitPaths() {}

function calcTopProduct() {}

// part 1 logic

// part 2 logic

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

  describe.todo("part 2 test cases", () => {
    const sampleInput = [];
    const sampleAnswers = [];

    it("", () => {});
  });
}
