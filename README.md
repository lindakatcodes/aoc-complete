# Advent of Code

This is my repo for all of my [advent of code](https://adventofcode.com) solutions.

## Structure and Packages

I've decided to organize the puzzles into individual files within their respective year. I like the inputs in a separate file since they're typically very large, but having them directly next to the puzzle file allows me to be a little more generic in my file generation which makes it more reliable.

Each puzzle file also has some Vitest tests in-source with the puzzle. This way I'm only watching the one file and it'll run my tests as I update the solution. 

There's also a `utils` folder that holds some common helper functions I use a lot in the puzzles, and some generation functions. These generators will create the daily puzzle files for you.

## Scripts

Here's how to run the scripts and what they do:

### Start

`npm start --year=## --date=##`

The start command needs to know what year and what date you want to work on. The year is the last two digits of the year (ex. 23 for 2023) and the date is the calendar date that's zero-padded (ex. 01 for 1 or 25 for 25)
