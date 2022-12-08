// @deno-types="npm:@types/lodash"
import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName: string) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input: string) => {
  return input.trim().split('\n').map((l) => l.split('').map((n) => parseInt(n, 10)));
};

const isTreeVisible = (treeHeight: number, treesInWay: number[]) => {
  return (treesInWay.length === 0) || treesInWay.every((t) => t < treeHeight);
};

const calculateVisibleTrees = (treeSquare: number[][]) => {
  const visibleTrees = Array(treeSquare.length).fill(false).map(() => Array(treeSquare[0].length).fill(false));
  for (let y = 0; y < treeSquare.length; y++) {
    for (let x = 0; x < treeSquare[y].length; x++) {
      const treeHeight = treeSquare[y][x];
      const leftOfTree = treeSquare[y].slice(0, x);
      const rightOfTree = treeSquare[y].slice(x + 1);
      const aboveTree = treeSquare.slice(0, y).map((row) => row[x]);
      const belowTree = treeSquare.slice(y + 1).map((row) => row[x]);
      const canBeSeen = [leftOfTree, rightOfTree, aboveTree, belowTree].some((treesInWay) => isTreeVisible(treeHeight, treesInWay));
      visibleTrees[y][x] = canBeSeen;
    }
  }
  return visibleTrees;
};

export const solve = (input: string) => {
  const treeSquare = parseInput(input);
  const visibleTrees = calculateVisibleTrees(treeSquare);
  return _.flatten(visibleTrees).filter((v) => v).length;
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
