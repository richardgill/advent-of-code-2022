// @deno-types="npm:@types/lodash"
import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName: string) => readRelativeInput(import.meta.url, fileName);

const extractNumberEndOfLine = (line: string) => {
  const match = line.match(/(\d+)$/);
  if (!match) {
    throw new Error(`Could not find number at end of line: ${line}`);
  }
  return parseInt(match[1], 10);
};

const extractOpFunction = (line: string) => {
  const isAddition = /\+/.test(line);
  const oldMatches = line.match(/old/g);

  if (_.isArray(oldMatches) && oldMatches.length > 1 && isAddition) {
    console.log('old + old');
    return (x: number) => x + x;
  } else if (_.isArray(oldMatches) && oldMatches.length > 1 && !isAddition) {
    console.log('old * old');
    return (x: number) => x * x;
  } else if (isAddition) {
    console.log(`old + ${extractNumberEndOfLine(line)}`);
    return (x: number) => x + extractNumberEndOfLine(line);
  }
  console.log(`old * ${extractNumberEndOfLine(line)}`);
  return (x: number) => x * extractNumberEndOfLine(line);
};

interface Monkey {
  id: number;
  items: number[];
  op: string;
  opFunction: (x: number) => number;
  divisibleBy: number;
  divisibleByTrue: number;
  divisibleByFalse: number;
}

type ItemDivisibleBy = _.Dictionary<number>;

type MonkeyModulo = Omit<Monkey, 'items'> & { items: ItemDivisibleBy[] };

const inspectionCounts = new Map<number, number>();

const monkeyDivisors = (monkeys: Monkey[]) => {
  return monkeys.map((m) => m.divisibleBy);
};

function calculateNewItem(opFunction: (x: number) => number, item: ItemDivisibleBy): ItemDivisibleBy {
  return _.mapValues(item, (i, key) => {
    return Math.floor(opFunction(i)) % parseInt(key, 10);
  });
}

const inspectItem = (monkey: MonkeyModulo, monkeys: MonkeyModulo[]) => {
  inspectionCounts.set(monkey.id, (inspectionCounts.get(monkey.id) || 0) + 1);
  const item = monkey.items[0];
  const newItem = calculateNewItem(monkey.opFunction, item);
  const throwTo = newItem[monkey.divisibleBy] === 0 ? monkey.divisibleByTrue : monkey.divisibleByFalse;
  const throwToMonkey = monkeys.find((m) => m.id === throwTo);
  if (!throwToMonkey) {
    throw new Error(`Could not find monkey with id ${throwTo}`);
  }
  throwToMonkey.items.push(newItem);
  monkey.items.shift();
};

const takeTurn = (monkey: MonkeyModulo, monkeys: MonkeyModulo[]) => {
  while (monkey.items.length > 0) {
    inspectItem(monkey, monkeys);
  }
};

const parseInput = (input: string): Monkey[] => {
  const monkeys = input.trim().split('\n\n').map((m) => {
    const [id, items, op, divisibleBy, divisibleByTrue, divisibleByFalse] = m.split('\n');
    return {
      id: parseInt(id.split(' ')[1], 10),
      items: items.split(': ')[1].split(', ').map((i) => parseInt(i, 10)),
      op: op,
      opFunction: extractOpFunction(op),
      divisibleBy: extractNumberEndOfLine(divisibleBy),
      divisibleByTrue: extractNumberEndOfLine(divisibleByTrue),
      divisibleByFalse: extractNumberEndOfLine(divisibleByFalse),
    };
  });
  return monkeys;
};

export const solve = (input: string) => {
  inspectionCounts.clear();

  const monkeysInput = parseInput(input);
  const monkeys: MonkeyModulo[] = monkeysInput.map((monkey) => {
    return {
      ...monkey,
      items: monkey.items.map((item) => {
        return _.fromPairs(monkeyDivisors(monkeysInput).map((divisor) => [divisor, item]));
      }),
    };
  });
  console.log('monkeys', monkeys);
  const roundCount = 10000;
  for (let round = 0; round < roundCount; round++) {
    for (let monkeyIndex = 0; monkeyIndex < monkeys.length; monkeyIndex++) {
      const monkey = monkeys[monkeyIndex];
      takeTurn(monkey, monkeys);
    }
  }
  const [a, b] = _.orderBy(Array.from(inspectionCounts.values()), (x) => x, 'desc').slice(0, 2);
  console.log([a, b]);
  return a * b;
};

console.log(solve(readInput('example1.txt')), '\n\n\n');

// console.log(solve(readInput('example2.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
