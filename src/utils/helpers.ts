import type { PathLike } from "node:fs";
import type { FileHandle } from "node:fs/promises";
import { readFile } from "node:fs/promises";

// Reads puzzle input and returns the data as a string
export async function readData(file: PathLike | FileHandle) {
  try {
    const data = await readFile(file, { encoding: "utf8" });
    return data;
  } catch (err) {
    console.log(err);
  }
}

// Returns a sum from an array of numbers
export function sumNumberArray(numArr: number[]) {
  return numArr.reduce((first, second) => {
    return first + second;
  }, 0);
}

export function splitNewLines(data: string) {
  return data.split(/\r\n|\n/g);
} 
