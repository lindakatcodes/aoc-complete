# Advent of Code

This is my repo for all of my [advent of code](https://adventofcode.com) solutions.

...or at least, it will be! I've been participating in AoC since 2016, and have gone through a few different iterations of how my setup looks. My goal is for this to be the final version of things, at least as far as JavaScript iterations are concerned. So I intend to port over my previous solutions into this new structure. However, I also want those puzzles to still be able to run, so some file cleanup to adjust how inputs are read and where helper functions are (and which still exist) will be needed too.

For now, I'm linking to my 3 previous repos here which are all archived. As I get the solutions ported over that I want to have here, I'll clean up these links. 
- 2016-2021: https://github.com/lindakatcodes/adventOfCode-JavaScript
- 2022: https://github.com/lindakatcodes/aoc-22
- 2023: https://github.com/lindakatcodes/aoc23

## Structure and Packages

I've decided to organize the puzzles into individual files within their respective year. I like the inputs in a separate file since they're typically very large, but having them directly next to the puzzle file allows me to be a little more generic in my file generation which makes it more reliable.

Each puzzle file also has some Vitest tests in-source with the puzzle. This way I'm only watching the one file and it'll run my tests as I update the solution.

There's also a `utils` folder that holds some common helper functions I use a lot in the puzzles, and some generation functions. These generators will create the daily puzzle files for you.

## Scripts

Here's how to run the scripts and what they do:

### Generate

`npm run generate --year=## --date=##`

Generates the puzzle files (and directories if needed) for whichever day you want to solve.

The year parameter is optional - if you don't pass it, it will default to the hard coded year on line 3 of `utils/createPuzzleFiles.ts`. If you're working on puzzles from a specific year it'll be fastest to update this default value.

Same as the `start` command, both `year` and `date` are double digits and zero padded.

### Test

`npm run test`

Each puzzle is set up with tests, and I recommend running the test command to do each puzzle. It will watch the file for changes and show both the test results and any console logs from the file itself.

By default Vitest will run all your tests. To keep things faster I recommend passing the year and date as an additional filter so it'll only run the test you're working on.

`npm run test 2015/01`

Both tests in a file are initially set in "todo" mode, so they won't show as failing. As you implement the tests, remember to remove the `.todo` from the describe so the test will actually run!

### Start

`npm start --year=## --date=##`

The start command needs to know what year and what date you want to work on. The year is the last two digits of the year (ex. 23 for 2023) and the date is the calendar date that's zero-padded (ex. 01 for 1 or 25 for 25)
