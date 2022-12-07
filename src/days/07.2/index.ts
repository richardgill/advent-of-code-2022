// @deno-types="npm:@types/lodash"
import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';
import * as path from 'https://deno.land/std@0.101.0/path/mod.ts';

const readInput = (fileName: string) => readRelativeInput(import.meta.url, fileName);

type LsOutput = { size: number; fileName: string };

type Command = { command: string; params: string; output: LsOutput[] };

const parseInput = (input: string) => {
  const lines = input.trim().split('\n');
  const commands: Command[] = [];

  for (const line of lines) {
    if (line.startsWith('$')) {
      const [command, params] = line.slice(2).split(' ');
      commands.push({ command, params, output: [] });
    } else {
      if (!line.startsWith('dir')) {
        const [size, fileName] = line.split(' ');
        _.last(commands)?.output.push({ size: parseInt(size, 10), fileName });
      }
    }
  }
  return commands;
};

const joinPaths = (path: string[], nextPath: string) => {
  if (nextPath === '..') {
    return path.slice(0, -1);
  }
  return [...path, nextPath];
};

const runCommands = (
  commands: Command[],
  currentDirectory: string[] = [],
  dirsSoFar: { dir: string; output: LsOutput[]; totalSize: number }[] = [],
) => {
  for (const command of commands) {
    if (command.command === 'cd') {
      currentDirectory = joinPaths(currentDirectory, command.params);
    } else if (command.command === 'ls') {
      dirsSoFar.push({ dir: path.join(...currentDirectory), output: command.output, totalSize: _.sum(command.output.map((o) => o.size)) });
    }
  }
  return dirsSoFar;
};

const countSlashes = (str: string) => (str.match(/\//g) || []).length;

const calculateTotals = (directories: {
  dir: string;
  output: LsOutput[];
  totalSize: number;
}[]) => {
  const mostNestedFirst = _.orderBy(directories, (d) => [countSlashes(d.dir), d.dir.length], 'desc');
  const results: { dir: string; totalSize: number }[] = [];
  for (let i = 0; i < mostNestedFirst.length; i++) {
    const dir = mostNestedFirst[i];
    const children = results.filter((r) =>
      r.dir.includes(dir.dir) && countSlashes(dir.dir === '/' ? '' : dir.dir) + 1 === countSlashes(r.dir)
    );
    results.push({ dir: dir.dir, totalSize: dir.totalSize + _.sum(children.map((c) => c.totalSize)) });
  }
  return results;
};

export const solve = (input: string) => {
  const commands = parseInput(input);
  const directories = calculateTotals(runCommands(commands));
  console.log(_.orderBy(directories, (d) => d.dir));
  const usedSpace = _.last(directories)?.totalSize || 0;
  const freeSpace = 70000000 - usedSpace;
  const needToFree = 30000000 - freeSpace;
  console.log('usedSpace', usedSpace);
  console.log('freeSpace', freeSpace);
  console.log('needToFree', needToFree);
  console.log(_.chain(directories).filter((d) => d.totalSize >= needToFree).orderBy((d) => d.totalSize, 'asc').value());
  return _.chain(directories).filter((d) => d.totalSize >= needToFree).orderBy((d) => d.totalSize, 'asc').first().value();
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
