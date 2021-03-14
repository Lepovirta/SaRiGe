/* global test, expect, describe */
import * as iterators from './iterators';

const middleIteratorTestData = [
  4,
  7,
  10,
  15,
];

const numericCompare = (a, b) => a - b;

describe('middleIterator', () => {
  test.each(middleIteratorTestData)('contains all the numbers between 0 and %d', (end) => {
    const expectedNumbers = [...Array(end).keys()];
    const generatedNumbers = [...iterators.middleIterator(end)];

    expect(generatedNumbers.sort(numericCompare)).toEqual(expectedNumbers);
  });

  test.each(middleIteratorTestData)('has no duplicates [%d]', (end) => {
    const generatedNumbers = [...iterators.middleIterator(end)];
    const expectedNumbers = [...new Set(generatedNumbers)].sort(numericCompare);

    expect(generatedNumbers.sort(numericCompare)).toEqual(expectedNumbers);
  });
});

describe('combinations', () => {
  test('produces all combinations without combining the same values together', () => {
    const input = [1, 2, 3, 4];
    const output = [...iterators.combinations(input)];

    expect(output).toEqual([
      [1, 2], [1, 3], [1, 4],
      [2, 3], [2, 4],
      [3, 4],
    ]);
  });
});
