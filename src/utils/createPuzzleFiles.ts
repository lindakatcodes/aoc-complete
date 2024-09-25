import { mkdir, writeFile } from "fs/promises";

const defaultYear = 2023;
const puzzleDay = Number(process.env.npm_config_date);
const puzzleYear = Number(`20${process.env.npm_config_year}`) || defaultYear;

if (!puzzleDay) {
  throw new Error(
    "The date is required to generate the files. Please try the command again and include '--date=##' to let the generator know what date the puzzle is for."
  );
}

// determine the puzzle and input file paths - padding the day so they stay sorted properly
const paddedDay = puzzleDay < 10 ? `0${puzzleDay}` : puzzleDay;
const yearFolder = `./src/${puzzleYear}`;
const dayFolder = `${yearFolder}/day${paddedDay}`;
const dayFile = `${dayFolder}/puzzle.ts`;
const inputFile = `${dayFolder}/input.txt`;

// make the template that should go in each puzzle file
const template = `
import * as h from "../../utils/helpers.js";
const initData = await h.readData("${inputFile}");

// functions

// part 1 logic

// part 2 logic

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('part 1 test cases', () => {
    const testData = [];
  });
  describe('part 2 test cases', () => {
    const testData = [];
  });
}
`;

// make the files, write to them, then close out
(async () => {
  try {
    // have to test making the year and day directories first, in case they don't exist
    // the recursive value here makes it so that if the folder already exists it doesn't error
    await mkdir(yearFolder, { recursive: true });
    await mkdir(dayFolder, { recursive: true });
    await writeFile(`${dayFile}`, template);
    await writeFile(inputFile, "");
    // final console log and close out
    console.log(`Files for day ${paddedDay} are created! Happy solving!`);
  } catch (error) {
    console.error(`Got an error trying to write the file: ${error.message}.`);
  }
})();
