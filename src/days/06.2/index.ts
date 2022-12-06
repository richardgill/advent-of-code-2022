// @deno-types="npm:@types/lodash"
import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName: string) => readRelativeInput(import.meta.url, fileName);

const LOOK_BACK = 14;

const isUniqueBetween = (str: string, start: number, end: number) => {
  const subStr = str.slice(start, end);
  const unique = new Set(subStr);
  return unique.size === subStr.length;
};

export const solve = (input: string) => {
  for (let i = LOOK_BACK; i < input.length; i++) {
    if (isUniqueBetween(input, i - LOOK_BACK, i)) {
      return i;
    }
  }
  throw new Error('Did not find answer');
};

console.log(solve('bvwbjplbgvbhsrlpgdmjqwftvncz'), '\n\n\n'); // prints 5
console.log(solve('nppdvjthqldpwncqszvftbrmjlhg'), '\n\n\n'); // prints 6
console.log(solve('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg'), '\n\n\n'); //prints 10
console.log(solve('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw'), '\n\n\n'); //prints 11

console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
