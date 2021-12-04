/* global test, expect, describe */
import * as array2d from './array2d';

test('array creation', () => {
  const width = 20;
  const height = 15;
  const placeholder = '-';

  const array = array2d.create(width, height, placeholder);

  expect(array.length).toEqual(width * height);
  expect(array.every((e) => e === placeholder)).toBe(true);
});

const testData = [
  [
    'single-line horizontal',
    {
      array: [
        'r', '-', '-', '-', 'a', '-', '-', '-', '-', 'p',
      ],
      width: 10,
      height: 1,
      placeholder: '-',
    },
    {
      content: 'sauna',
      position: { x: 3, y: 0, vertical: false },
    },
    [
      'r', '-', '-', 's', 'a', 'u', 'n', 'a', '-', 'p',
    ],
  ],
  [
    'multi-line horizontal',
    {
      array: [
        '-', '-', '-', '-', '-', '-', '-', '-', '-', '-',
        'r', '-', '-', '-', 'a', '-', '-', '-', '-', 'p',
        '-', '-', '-', '-', '-', '-', '-', '-', '-', '-',
      ],
      width: 10,
      height: 3,
      placeholder: '-',
    },
    {
      content: 'sauna',
      position: { x: 3, y: 1, vertical: false },
    },
    [
      '-', '-', '-', '-', '-', '-', '-', '-', '-', '-',
      'r', '-', '-', 's', 'a', 'u', 'n', 'a', '-', 'p',
      '-', '-', '-', '-', '-', '-', '-', '-', '-', '-',
    ],
  ],
  [
    'multi-line vertical',
    {
      array: [
        '-', '-', '-', '-', '-', '-', '-', '-', '-', '-',
        'r', '-', '-', '-', '-', '-', '-', '-', '-', 'p',
        '-', '-', '-', '-', 'a', '-', 'h', '-', '-', '-',
        '-', '-', 'x', '-', '-', '-', '-', '-', '-', '-',
        '-', '-', '-', '-', '-', '-', '-', '-', '-', '-',
        '-', '-', '-', '-', 'a', '-', '-', '-', '-', '-',
      ],
      width: 10,
      height: 6,
      placeholder: '-',
    },
    {
      content: 'sauna',
      position: { x: 4, y: 1, vertical: true },
    },
    [
      '-', '-', '-', '-', '-', '-', '-', '-', '-', '-',
      'r', '-', '-', '-', 's', '-', '-', '-', '-', 'p',
      '-', '-', '-', '-', 'a', '-', 'h', '-', '-', '-',
      '-', '-', 'x', '-', 'u', '-', '-', '-', '-', '-',
      '-', '-', '-', '-', 'n', '-', '-', '-', '-', '-',
      '-', '-', '-', '-', 'a', '-', '-', '-', '-', '-',
    ],
  ],
];

const invalidTestData = [
  [
    'conflicting content',
    {
      array: [
        '-', '-', '-', '-', '-', '-', '-', '-', '-', '-',
        'r', '-', '-', '-', 's', '-', '-', '-', '-', 'p',
        '-', '-', '-', '-', 'a', '-', 'h', '-', '-', '-',
        '-', '-', 'x', '-', 'u', '-', '-', '-', '-', '-',
        '-', '-', '-', '-', 'n', '-', '-', '-', '-', '-',
        '-', '-', '-', '-', 'a', '-', '-', '-', '-', '-',
      ],
      width: 10,
      height: 6,
      placeholder: '-',
    },
    {
      content: 'vihta',
      position: { x: 3, y: 2, vertical: false },
    },
  ],
  [
    'fully overlapping content',
    {
      array: [
        '-', '-', '-', '-', '-', '-', '-', '-', '-', '-',
        'r', '-', 'c', 'o', 'u', 'r', 'a', 'g', 'e', '-',
        '-', '-', '-', '-', '-', '-', '-', '-', '-', '-',
      ],
      width: 10,
      height: 3,
      placeholder: '-',
    },
    {
      content: 'age',
      position: { x: 6, y: 1, vertical: false },
    },
  ],
  [
    'partially overlapping content',
    {
      array: [
        '-', '-', '-', '-', '-', '-', '-', '-', '-', '-',
        'm', 'e', 's', 's', 'a', 'g', 'e', '-', '-', '-',
        '-', '-', '-', '-', '-', '-', '-', '-', '-', '-',
      ],
      width: 10,
      height: 3,
      placeholder: '-',
    },
    {
      content: 'gear',
      position: { x: 5, y: 1, vertical: false },
    },
  ],
];

describe('array2d.insert', () => {
  test.each(testData)('inserts content into array: %s', (name, destination, source, expectation) => {
    const copiedDest = { ...destination, array: [...destination.array] };

    array2d.insert(copiedDest, source);

    expect(copiedDest.array).toEqual(expectation);
  });
});

describe('array2d.fits', () => {
  test.each(testData)('fits content into array: %s', (name, destination, source) => {
    const result = array2d.fits(destination, source);

    expect(result).toBe(true);
  });

  test.each(invalidTestData)('does not fit content into array: %s', (name, destination, source) => {
    const result = array2d.fits(destination, source);

    expect(result).toBe(false);
  });
});

const positionIteratorTestData = [
  [
    {
      position: { x: 0, y: 0, vertical: false },
      length: 4,
      width: 8,
    },
    [[0, 0], [1, 0], [2, 0], [3, 0]],
  ],
  [
    {
      position: { x: 0, y: 0, vertical: true },
      length: 4,
      width: 8,
    },
    [[0, 0], [0, 1], [0, 2], [0, 3]],
  ],
  [
    {
      position: { x: 3, y: 3, vertical: true },
      length: 3,
      width: 10,
    },
    [[3, 3], [3, 4], [3, 5]],
  ],
];

describe('array2d.relativePositionToIndex', () => {
  test.each(positionIteratorTestData)('produces positions relative to given index', (input, output) => {
    const getIndex = array2d.relativePositionToIndex(input.width, input.position);
    const positions = [];

    for (let i = 0; i < input.length; i += 1) {
      const index = getIndex(i);
      positions.push(
        [index % input.width, Math.floor(index / input.width)],
      );
    }

    expect(positions).toEqual(output);
  });
});
