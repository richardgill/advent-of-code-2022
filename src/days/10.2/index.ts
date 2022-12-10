// @deno-types="npm:@types/lodash"
import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';
import { writeAllSync } from 'https://deno.land/std/streams/conversion.ts';

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

const log = (text: string) => {
  writeAllSync(Deno.stdout, new TextEncoder().encode(text));
};

const drawScreen = (getCycleValues: number[]) => {
  for (let i = 0; i < getCycleValues.length; i++) {
    const value = getCycleValues[i];
    const spriteStart = value - 1;
    const spriteEnd = value + 1;
    const row = Math.floor(i / 40);
    const xIndex = i - (row * 40);
    if (xIndex >= spriteStart && xIndex <= spriteEnd) {
      log('#');
    } else {
      log('.');
    }
    if ((i + 1) % 40 === 0) {
      log('\n');
    }
  }
};

export const solve = (input: string) => {
  const commands = parseInput(input);
  const cycleValues = runCommands(commands);
  drawScreen(cycleValues);
};

// console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('example2.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
