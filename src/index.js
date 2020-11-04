import './style.css';
import { Grid, NoCandidatesError } from './grid';
import GridRange from './gridrange';
import * as ui from './ui';

const defaultOptions = {
  fillerLetters: 'abcdefghijklmnopqrstuvwxyz',
  words: [
    'gate',
    'message',
    'courage',
    'desk',
    'lamp',
    'vehicle',
    'beer',
    'speaker',
    'bread',
    'guitar',
    'machine',
    'computer',
  ],
  gridSize: { x: 20, y: 20 },
  overlapWeight: 4,
  maxGenerations: 1000,
};

function generateGrid(options) {
  for (let i = 0; i < options.maxGenerations; i += 1) {
    try {
      const grid = new Grid(
        new GridRange(options.gridSize.x, options.gridSize.y),
        options.overlapWeight,
      );
      grid.fillWordsRandomly(options.words);
      grid.fillEmptySpots(options.fillerLetters);
      return grid;
    } catch (err) {
      if (!(err instanceof NoCandidatesError)) {
        throw err;
      }
    }
  }
  return null;
}

window.document.addEventListener('DOMContentLoaded', () => {
  ui.setOptions(defaultOptions);
  ui.setup(
    (options) => generateGrid({ ...defaultOptions, ...options }),
  );
});
