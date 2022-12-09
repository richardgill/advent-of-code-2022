// @deno-types="npm:@types/lodash"
import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const parseInput = (input: string) => {
  return input.trim().split('\n').map((l) => {
    const [direction, distance] = l.split(' ');
    return {
      direction,
      distance: parseInt(distance, 10),
    };
  });
};

const readInput = (fileName: string) => readRelativeInput(import.meta.url, fileName);

type Move = { direction: string; distance: number };
type Coordinate = { x: number; y: number };

const printGrid = (grid: string[][], headPosition: Coordinate, tailPositions: Coordinate[]) => {
  const gridCopy = grid.map((l) => l.slice());
  for (let i = 0; i < tailPositions.length; i++) {
    const tailPosition = tailPositions[i];
    if (['#', '.'].includes(gridCopy[tailPosition.y][tailPosition.x])) {
      gridCopy[tailPosition.y][tailPosition.x] = `${i + 1}`;
    }
  }

  gridCopy[headPosition.y][headPosition.x] = 'H';
  console.log(gridCopy.map((l) => l.join('')).join('\n'));
  console.log('\n');
};

const calculateTailPosition = (headPosition: Coordinate, tailPosition: Coordinate): Coordinate => {
  // same column
  if (headPosition.x === tailPosition.x) {
    // moving up
    if (tailPosition.y - headPosition.y > 1) {
      return { x: tailPosition.x, y: tailPosition.y - 1 };
    } else if (tailPosition.y - headPosition.y < -1) {
      // moving down
      return { x: tailPosition.x, y: tailPosition.y + 1 };
      // same row
    }
  } else if (headPosition.y === tailPosition.y) {
    // moving left more than one
    if (tailPosition.x - headPosition.x > 1) {
      return { x: tailPosition.x - 1, y: tailPosition.y };
    } else if (tailPosition.x - headPosition.x < -1) {
      // moving right
      return { x: tailPosition.x + 1, y: tailPosition.y };
    }
    // diagonals
  } else if ((Math.abs(tailPosition.x - headPosition.x) + Math.abs(tailPosition.y - headPosition.y)) > 2) {
    // moving up and left
    const yDistance = tailPosition.y - headPosition.y;
    const xDistance = tailPosition.x - headPosition.x;
    if (yDistance > 0 && xDistance > 0) {
      return { x: tailPosition.x - 1, y: tailPosition.y - 1 };
    } else if (yDistance > 0 && xDistance < 0) {
      // moving up and right
      return { x: tailPosition.x + 1, y: tailPosition.y - 1 };
    } else if (yDistance < 0 && xDistance > 0) {
      // moving down and left
      return { x: tailPosition.x - 1, y: tailPosition.y + 1 };
    } else if (yDistance < 0 && xDistance < 0) {
      // moving down and right
      return { x: tailPosition.x + 1, y: tailPosition.y + 1 };
    }
  }
  // no move
  return tailPosition;
};

const calculateTailPositions = (headPosition: Coordinate, tailPositions: Coordinate[]): Coordinate[] => {
  let head = headPosition;
  for (const tailPosition of tailPositions) {
    const newTailPosition = calculateTailPosition(head, tailPosition);
    tailPosition.x = newTailPosition.x;
    tailPosition.y = newTailPosition.y;
    head = tailPosition;
  }
  return tailPositions;
};

const do1Move = (grid: string[][], direction: string, headPosition: Coordinate, tailPositions: Coordinate[]) => {
  switch (direction) {
    case 'R':
      headPosition.x += 1;
      break;
    case 'L':
      headPosition.x -= 1;
      break;
    case 'U':
      headPosition.y -= 1;
      break;
    case 'D':
      headPosition.y += 1;
      break;
  }
  const newTailPositions = calculateTailPositions(headPosition, tailPositions);
  const lastTailPosition = _.last(newTailPositions);
  if (!lastTailPosition) {
    throw new Error('no tail position');
  }
  grid[lastTailPosition.y][lastTailPosition.x] = '#';
  printGrid(grid, headPosition, newTailPositions);
};

const doMove = (grid: string[][], move: Move, headPosition: Coordinate, tailPositions: Coordinate[]) => {
  const { direction, distance } = move;

  for (let i = 0; i < distance; i++) {
    do1Move(grid, direction, headPosition, tailPositions);
  }
};

export const solve = (input: string, gridWidth: number, gridHeight: number, customStartCoordX?: number, customStartCoordY?: number) => {
  console.log('---------solve--------');
  const grid = Array(gridHeight).fill('.').map(() => Array(gridWidth).fill('.'));
  const moves = parseInput(input);
  const startCoord = { x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) };
  const headPosition = !_.isNil(customStartCoordX) && !_.isNil(customStartCoordY)
    ? { x: customStartCoordX, y: customStartCoordY }
    : startCoord;
  const tailPosition = { ...headPosition };
  const tails = _.range(0, 9).map(() => ({ ...tailPosition }));
  console.log('tails', tails.length);
  for (const move of moves) {
    console.log(move);
    doMove(grid, move, headPosition, tails);
  }
  return _.chain(grid).flatten().filter((c) => c === '#').value().length;
};

console.log(solve(readInput('example1.txt'), 6, 6, 0, 4), '\n\n\n');

console.log(solve(readInput('example2.txt'), 30, 25, 12, 25 - 7), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt'), 9999, 9999), '\n\n\n');
