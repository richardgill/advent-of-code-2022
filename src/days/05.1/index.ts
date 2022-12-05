// @deno-types="npm:@types/lodash"
import _ from 'lodash';

import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName: string) => readRelativeInput(import.meta.url, fileName);

// parses a string like this:
// [D]
// [N] [C]
// [Z] [M] [P]
//  1   2   3

// and produces:
// {1: ["Z", "N", "D"], 2: ['M', 'C', 'D'], 3: ['P']}
const parseStacks = (input: string) => {
  const stacks: Record<string, string[]> = {};
  const stacksString = input.split('\n\n')[0];
  _.dropRight(stacksString.split('\n'), 1).forEach((chars) => {
    let index = 1;
    let stack = 1;
    while (index < chars.length) {
      if (!stacks[stack]) {
        stacks[stack] = [];
      }
      if (chars[index] !== ' ') {
        stacks[stack].push(chars[index]);
      }

      index += 4;
      stack++;
    }
  });

  return _.mapValues(stacks, (stack) => _.reverse(stack));
};

// parses a string like this:
// move 1 from 2 to 1
// move 3 from 1 to 3
// move 2 from 2 to 1
// move 1 from 1 to 2
// into:
// [{from: 2, to: 1, count: 1}, {from: 1, to: 3, count: 3}, {from: 2, to: 1, count: 2}, {from: 1, to: 2, count: 1}]
const parseMoves = (input: string) => {
  const movesString = input.split('\n\n')[1].trim();
  return movesString.split('\n').map((line) => {
    const matches = line.match(/move (\d+) from (\d+) to (\d+)/);
    if (!matches) {
      throw new Error('Invalid move: ' + line);
    }
    const [_, count, from, to] = matches;
    return { count: parseInt(count), from: parseInt(from), to: parseInt(to) };
  });
};

const applyMove = (
  stacks: Record<string, string[]>,
  move: { count: number; from: number; to: number },
): Record<string, string[]> => {
  const fromStack = stacks[move.from];
  const toStack = stacks[move.to];
  const count = move.count;
  const discs = fromStack.splice(fromStack.length - count, count);
  toStack.push(..._.reverse(discs));
  return stacks;
};

export const solve = (input: string) => {
  let stacks = parseStacks(input);
  const moves = parseMoves(input);
  for (const move of moves) {
    stacks = applyMove(stacks, move);
  }
  return _.values(stacks).map((stack) => _.last(stack)).join('');
};

console.log(solve(readInput('example1.txt')), '\n\n\n');

// console.log(solve(readInput('example2.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
