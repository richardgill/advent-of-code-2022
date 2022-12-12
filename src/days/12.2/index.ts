// @deno-types="npm:@types/lodash"
import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName: string) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input: string) => {
  return input.trim().split('\n').map((line) => line.split(''));
};

type Elavation = {
  elavation: string;
  distance: number;
  x: number;
  y: number;
  isFinishNode: boolean;
  isVisited: boolean;
  charCode: number;
  adjacentNodes?: Elavation[];
};

const findShortestPath = (
  elavations: Elavation[],
) => {
  let i = 0;
  while (true) {
    const unvisited = elavations.filter((e) => !e.isVisited);
    const currentShortest = unvisited.sort((a, b) => a.distance - b.distance)[0];
    if (!currentShortest) {
      return 99999999;
    }
    currentShortest.isVisited = true;
    const adjacentNodes = (currentShortest.adjacentNodes ?? []).filter((e) => !e.isVisited);
    for (const adjacentNode of adjacentNodes) {
      adjacentNode.distance = Math.min(adjacentNode.distance, currentShortest.distance + 1);
    }
    const finishNode = adjacentNodes.find((e) => e.isFinishNode);

    if (finishNode) {
      console.log('i', i);
      return finishNode.distance;
    }
    i++;
  }
};

const shortestDistance = (elavations: string[][]) => {
  const elavationsWithDistances: Elavation[] = elavations.map((e, y) =>
    e.map((e1, x) => {
      const e = e1 === 'S' ? 'a' : e1 === 'E' ? 'z' : e1;
      return {
        elavation: e,
        distance: e1 === 'S' ? 0 : 99999999,
        isFinishNode: e1 === 'E',
        charCode: e.charCodeAt(0),
        x,
        y,
        isVisited: false,
      };
    })
  ).flat();
  for (const e of elavationsWithDistances) {
    e.adjacentNodes = elavationsWithDistances.filter((e1) =>
      (e1.charCode - e.charCode) <= 1 &&
      (Math.abs(e.x - e1.x) + Math.abs(e.y - e1.y)) === 1
    );
  }

  return findShortestPath(
    elavationsWithDistances,
  );
};

const allStartPoints = (elavations: string[][]) => {
  const es = elavations.map((row) => row.map((char) => char === 'S' ? 'a' : char));
  const aCoordinates = es.map((e, y) => e.map((e1, x) => e1 === 'a' ? { x, y } : null)).flat().filter((e) => e);
  const startElevations = [];
  for (const aCoordinate of aCoordinates) {
    if (aCoordinate) {
      const elavation = _.cloneDeep(es);
      elavation[aCoordinate.y][aCoordinate.x] = 'S';
      startElevations.push(elavation);
    }
  }
  return startElevations;
};

export const solve = (input: string) => {
  const elavations = parseInput(input);
  const asps = allStartPoints(elavations);
  return _.chain(asps).map((e, index) => {
    console.log(`start point ${index + 1} of ${asps.length}`);
    return shortestDistance(e);
  }).min().value();
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
