/* global test, expect */
import { Grid, NoCandidatesError } from './grid';
import GridRange from './gridrange';

const testFillerLetters = 'qwertyuiopasdfghjklzxcvbnm';
const testWords = [
  'somebody',
  'once',
  'told',
  'me',
  'the',
  'world',
  'is',
  'gonna',
  'roll',
  'me',
];

function createGrid(gridRange, fillerLetters) {
  for (let i = 0; i < 1000; i += 1) {
    try {
      const grid = new Grid(gridRange, 4);
      grid.fillWordsRandomly(testWords);
      if (fillerLetters) {
        grid.fillEmptySpots(fillerLetters);
      }
      return grid;
    } catch (err) {
      if (!(err instanceof NoCandidatesError)) {
        throw err;
      }
    }
  }
  throw Error(`no grid of size (${gridRange.x}, ${gridRange.y}) could be generated after 1000 iterations`);
}

const gridsWithFillers = [
  [10, 10],
  [15, 15],
  [20, 20],
  [30, 30],
  [40, 40],
].map(
  ([x, y]) => createGrid(new GridRange(x, y), testFillerLetters),
);

const gridsWithNoFillers = [
  [10, 10],
  [15, 15],
  [20, 20],
  [30, 30],
  [40, 40],
].map(
  ([x, y]) => createGrid(new GridRange(x, y)),
);

test.each(gridsWithFillers)('grid is filled with letters', (grid) => {
  grid.grid.forEach((row) => {
    row.forEach((char) => {
      expect(char).not.toEqual(' ');
    });
  });
});

test.each(gridsWithFillers)('grid contains all the words', (grid) => {
  const positions = [...grid.gridRange];
  testWords.forEach((word) => {
    const wordIsFound = positions.some(
      (pos) => grid.getRow(pos).join('').includes(word)
        || grid.getColumn(pos).join('').includes(word),
    );
    expect(wordIsFound).toEqual(true);
  });
});

test.each(gridsWithNoFillers)('grid filled words are found from answers', (grid) => {
  const positions = [...grid.gridRange];
  positions.forEach((pos) => {
    if (grid.grid[pos.y][pos.x] === ' ') {
      expect(grid.answerPositions).not.toContainEqual(pos);
    } else {
      expect(grid.answerPositions).toContainEqual(pos);
    }
  });
});
