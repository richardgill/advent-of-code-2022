// @deno-types="npm:@types/lodash"
import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName: string) => readRelativeInput(import.meta.url, fileName);

export const solve = (input: string) => {
  console.log(input);
  return 'answer';
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
// console.log(solve(readInput('example2.txt')), '\n\n\n');
// console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
