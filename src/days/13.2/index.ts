// @deno-types="npm:@types/lodash"
import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName: string) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input: string) => {
  return input.trim().split('\n\n').map((l) => l.trim().split('\n').map((l) => JSON.parse(l.trim()))).flat();
};

type PacketArray = number | Array<number | PacketArray> | undefined;

type Result = 'correctOrder' | 'wrongOrder' | 'unknown';

const isCorrectOrder = (left: PacketArray, right: PacketArray): Result => {
  if (_.isArray(left) && _.isArray(right)) {
    if (_.isEmpty(left) && _.isEmpty(right)) {
      return 'unknown';
    }
    const leftHead = _.first(left);
    const rightHead = _.first(right);
    if (_.isNil(leftHead) && !_.isNil(rightHead)) {
      return 'correctOrder';
    }
    if (!_.isNil(leftHead) && _.isNil(rightHead)) {
      return 'wrongOrder';
    }
    if (_.isNumber(leftHead) && _.isNumber(rightHead)) {
      if (leftHead < rightHead) {
        return 'correctOrder';
      }
      if (leftHead > rightHead) {
        return 'wrongOrder';
      }
      return isCorrectOrder(_.tail(left), _.tail(right));
    }
    const res = isCorrectOrder(leftHead, rightHead);
    if (['correctOrder', 'wrongOrder'].includes(res)) {
      return res;
    }
    return isCorrectOrder(_.tail(left), _.tail(right));
  } else if (_.isArray(left) && !_.isArray(right)) {
    return isCorrectOrder(left, [right]);
  } else if (!_.isArray(left) && _.isArray(right)) {
    return isCorrectOrder([left], right);
  } else {
    console.log(left, right);
    if (_.isNil(left) && !_.isNil(right)) {
      return 'correctOrder';
    } else if (!_.isNil(left) && _.isNil(right)) {
      return 'wrongOrder';
    }
  }
  throw new Error('Never happens');
};

export const solve = (input: string) => {
  console.log(`${input}\n[[2]]\n[[6]]`);
  const lines = parseInput(`${input}\n\n[[2]]\n[[6]]`);
  lines.sort((left, right) => {
    const res = isCorrectOrder(left, right);
    return res === 'correctOrder' ? -1 : 1;
  });

  console.log(lines);
  const index1 = lines.findIndex((line) => _.isEqual(line, [[2]])) + 1;
  const index2 = lines.findIndex((line) => _.isEqual(line, [[6]])) + 1;
  console.log(index1, index2);
  return (index1 * index2);
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
// console.log(solve(readInput('broken2.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
