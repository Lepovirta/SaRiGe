/* global test, expect, describe */
import * as iterators from './iterators';

const dcIteratorTestData = [
  4,
  7,
  10,
  15,
];

const numericCompare = (a, b) => a - b;

describe('dcIterator', () => {
  test.each(dcIteratorTestData)('contains all the numbers between 0 and %d', (end) => {
    const expectedNumbers = [...Array(end).keys()];
    const generatedNumbers = [...iterators.dcIterator(end)];

    expect(generatedNumbers.sort(numericCompare)).toEqual(expectedNumbers);
  });

  test.each(dcIteratorTestData)('has no duplicates [%d]', (end) => {
    const generatedNumbers = [...iterators.dcIterator(end)];
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

function* itemsGen(items) {
  for (let i = 0; i < items.length; i += 1) {
    yield items[i];
  }
}

describe('alternate', () => {
  test('alternates between results from two generators', () => {
    const contents = [...iterators.alternate(
      () => itemsGen([1, 2, 3, 4]),
      () => itemsGen(['a', 'b', 'c', 'd']),
    )];

    expect(contents).toEqual([
      1, 'a',
      2, 'b',
      3, 'c',
      4, 'd',
    ]);
  });

  test('finishes both generators', () => {
    const contents1 = [...iterators.alternate(
      () => itemsGen([1, 2, 3]),
      () => itemsGen(['a', 'b', 'c', 'd']),
    )];

    expect(contents1).toEqual([
      1, 'a',
      2, 'b',
      3, 'c',
      'd',
    ]);

    const contents2 = [...iterators.alternate(
      () => itemsGen([1, 2, 3, 4]),
      () => itemsGen(['a', 'b']),
    )];

    expect(contents2).toEqual([
      1, 'a',
      2, 'b',
      3,
      4,
    ]);
  });
});
