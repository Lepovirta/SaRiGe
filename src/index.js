import './style.css';
import solver from './solver';
import * as ui from './ui';

const defaultOptions = {
  fillerLetters: 'abcdefghijklmnopqrstuvwxyz',
  allWords: [
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
  boardSize: { width: 15, height: 15 },
  shuffle: true,
  expectedScore: 0.8,
};

function generateBoard(options) {
  const board = solver(options);
  if (board === null) {
    throw new Error('failed to generate board');
  }

  return board;
}

window.document.addEventListener('DOMContentLoaded', () => {
  ui.setOptions(defaultOptions);
  ui.setup(
    (options) => generateBoard({ ...defaultOptions, ...options }),
  );
});
