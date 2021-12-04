import './style.css';
import solver from './solver';
import * as ui from './ui';
import defaultOptions from './defaults';

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
