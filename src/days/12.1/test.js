import { assertEquals } from 'https://deno.land/std@0.114.0/testing/asserts.ts';

import { solve } from './index.ts';

const testCases = [{ input: `input123`, solution: 'answer' }];

for (const testCase of testCases) {
  Deno.test(`${testCase.input}: ${testCase.solution}`, () => {
    assertEquals(solve(testCase.input), testCase.solution);
  });
}
