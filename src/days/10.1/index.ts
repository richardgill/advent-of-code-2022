// @deno-types="npm:@types/lodash"
import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName: string) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input: string) => {
  return input.trim().split('\n').map((l) => {
    const [command, value] = l.split(' ');
    return { command, value: parseInt(value, 10) };
  });
};

const runCommands = (commands: { command: string; value: number }[]) => {
  const cycleValues: number[] = [1];
  for (const c of commands) {
    const x = _.last(cycleValues) ?? -1;
    const { command, value } = c;
    if (command === 'noop') {
      cycleValues.push(x);
    } else if (command === 'addx') {
      if (cycleValues.length > 215 && cycleValues.length < 222) {
        console.log(cycleValues.length, command, value, _.takeRight(cycleValues, 5), x);
      }
      cycleValues.push(x);
      cycleValues.push(x + value);
    }
  }
  return cycleValues;
};

export const solve = (input: string) => {
  const commands = parseInput(input);
  const cycleValues = runCommands(commands);

  return (cycleValues[19] * 20 +
    cycleValues[59] * 60 +
    cycleValues[99] * 100 +
    cycleValues[139] * 140 +
    cycleValues[179] * 180 +
    cycleValues[219] * 220);
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('example2.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
