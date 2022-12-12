// @deno-types="npm:@types/lodash"
import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName: string) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input: string) => {
  return input.trim().split('\n').map((line) => line.split(''));
};

const findShortestPath = (
  elavations: { elavation: string; distance: number; x: number; y: number; isFinishNode: boolean }[],
  visited: boolean[][],
) => {
  let i = 0;
  while (true) {
    // console.log('visited', visited);

    const unvisited = elavations.filter((e) => !visited[e.y][e.x]);

    // console.log('unvisited', unvisited);
    const currentShortest = unvisited.sort((a, b) => a.distance - b.distance)[0];
    // console.log('currentShortest', currentShortest);
    visited[currentShortest.y][currentShortest.x] = true;
    const adjacentNodes = elavations.filter((e) =>
      (e.elavation.charCodeAt(0) - currentShortest.elavation.charCodeAt(0)) <= 1 &&
      (Math.abs(e.x - currentShortest.x) + Math.abs(e.y - currentShortest.y)) === 1 &&
      !visited[e.y][e.x]
    );

    for (const adjacentNode of adjacentNodes) {
      adjacentNode.distance = Math.min(adjacentNode.distance, currentShortest.distance + 1);
    }
    const finishNode = adjacentNodes.find((e) => e.isFinishNode);

    if (finishNode) {
      return finishNode.distance;
    }
    // console.log('adjacentNodes', adjacentNodes);
    if (i > 0) {
      // throw new Error('stop');
    }
    i++;
  }
};

export const solve = (input: string) => {
  const elavations = parseInput(input);
  const width = elavations[0].length;
  const height = elavations.length;
  const elavationsWithDistances = elavations.map((e) =>
    e.map((e1) => ({ elavation: e1 === 'S' ? 'a' : e1 === 'E' ? 'z' : e1, distance: e1 === 'S' ? 0 : 99999999, isFinishNode: e1 === 'E' }))
  );
  // console.log('elavationsWithDistances', elavationsWithDistances);
  const shortestPath = findShortestPath(
    elavationsWithDistances.map((e, y) => e.map((e1, x) => ({ ...e1, x, y }))).flat(),
    Array.from({ length: height }, () => Array.from({ length: width }, () => false)),
  );
  return shortestPath;
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
// console.log(solve(readInput('example2.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
