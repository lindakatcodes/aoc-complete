import * as h from "../../utils/helpers.js";
const initData = (await h.readData("./src/2025/day11/input.txt")) as string;

// known variables
const serverList = h.splitNewLines(initData);

// functions
function parseMachines(list: Array<string>) {
  const machineObjects = list.map((item) => {
    const splitItem = item.split(": ");
    const name = splitItem[0];
    const outputs = splitItem[1].split(" ");
    return {
      name,
      outputs,
    };
  });

  const machines = new Map();

  machineObjects.forEach((machine) => machines.set(machine.name, machine));

  return machines;
}

function findAllPaths(input: Array<string>) {
  const servers = parseMachines(input);
  let paths = 0;

  // add our starting server to the queue
  const queue = ["you"];

  while (queue.length > 0) {
    // pop the server off the queue
    const serverName = queue.pop();
    const server = servers.get(serverName)!;

    if (server.outputs.includes("out")) {
      // if it's output is out, it's a full path and we up our count
      paths++;
    } else {
      // otherwise, we need to then visit those outputs next, so add them to the queue
      server.outputs.forEach((item) => queue.push(item));
    }
  }
  return paths;
}

function findSpecificPaths(input: Array<string>) {
  const servers = parseMachines(input);
  const cache = new Map();

  // defining this function here so it can directly use the cache and our servers
  function countPaths(currServer, dacSeen, fftSeen) {
    const cacheKey = `${currServer}-${dacSeen}-${fftSeen}`;

    // we've seen this before, directly return it
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const server = servers.get(currServer)!;

    if (server.outputs.includes("out")) {
      // the end point, if we've seen both the required servers it counts, otherwise it doesn't
      return dacSeen && fftSeen ? 1 : 0;
    } else {
      // need to them recursively count the total paths to out from this server, making sure to update the seen state for our required servers if we encounter them
      let totalPaths = 0;
      server.outputs.forEach((server) => {
        const nextDacSeen = server === "dac" ? true : dacSeen;
        const nextFftSeen = server === "fft" ? true : fftSeen;

        totalPaths += countPaths(server, nextDacSeen, nextFftSeen);
      });

      // once we've reached here, this specific chain is completed and we can add it to the cache so we don't have to go over it every time we see it
      cache.set(cacheKey, totalPaths);
      // also have to return the totalPaths count - this ends up being our final answer, so not returning this causes the function to fail
      return totalPaths;
    }
  }

  return countPaths("svr", false, false);
}

// part 1 logic
const possiblePaths = findAllPaths(serverList);
console.log(`part 1: ${possiblePaths}`);

// part 2 logic
const possibleSpecificPaths = findSpecificPaths(serverList);
console.log(`part 2: ${possibleSpecificPaths}`);

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("part 1 test cases", () => {
    const sampleInput = [
      "aaa: you hhh",
      "you: bbb ccc",
      "bbb: ddd eee",
      "ccc: ddd eee fff",
      "ddd: ggg",
      "eee: out",
      "fff: out",
      "ggg: out",
      "hhh: ccc fff iii",
      "iii: out",
    ];
    const samplePaths = 5;

    it("solves part 1", () => {
      const testPaths = findAllPaths(sampleInput);
      expect(testPaths).toEqual(samplePaths);
    });
  });

  describe("part 2 test cases", () => {
    const sampleInput = [
      "svr: aaa bbb",
      "aaa: fft",
      "fft: ccc",
      "bbb: tty",
      "tty: ccc",
      "ccc: ddd eee",
      "ddd: hub",
      "hub: fff",
      "eee: dac",
      "dac: fff",
      "fff: ggg hhh",
      "ggg: out",
      "hhh: out",
    ];
    const samplePaths = 2;

    it("solves part 2", () => {
      const testPaths = findSpecificPaths(sampleInput);
      expect(testPaths).toEqual(samplePaths);
    });
  });
}
