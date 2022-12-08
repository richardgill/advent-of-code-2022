// @deno-types="npm:@types/lodash"
import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName: string) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input: string) => {
  return input.trim().split('\n').map((l) => l.split('').map((n) => parseInt(n, 10)));
};

const multipleArray = (array: number[]) => array.reduce((acc, val) => acc * val, 1);

const reverseArray = (array: number[]) => [...array].reverse();

const viewDistance = (treeHeight: number, treesInWay: number[]) => {
  let distance = 0;
  while (distance < treesInWay.length && treesInWay[distance] < treeHeight) {
    distance++;
  }
  // got to end of row
  if (distance >= treesInWay.length) {
    return distance;
  }
  // blocked by tree
  return distance + 1;
};

const calculateViewDistances = (treeSquare: number[][]) => {
  const visibleTrees = Array(treeSquare.length).fill(false).map(() => Array(treeSquare[0].length).fill(false));
  for (let y = 0; y < treeSquare.length; y++) {
    for (let x = 0; x < treeSquare[y].length; x++) {
      const treeHeight = treeSquare[y][x];
      const leftOfTree = reverseArray(treeSquare[y].slice(0, x));
      const rightOfTree = treeSquare[y].slice(x + 1);
      const aboveTree = reverseArray(treeSquare.slice(0, y).map((row) => row[x]));
      const belowTree = treeSquare.slice(y + 1).map((row) => row[x]);
      const viewDistances = [aboveTree, leftOfTree, rightOfTree, belowTree].map((treesInWay) => viewDistance(treeHeight, treesInWay));
      visibleTrees[y][x] = multipleArray(viewDistances);
    }
  }
  return visibleTrees;
};

export const solve = (input: string) => {
  const treeSquare = parseInput(input);
  const viewDistances = calculateViewDistances(treeSquare);
  return _.chain(viewDistances).flatten().max().value();
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
