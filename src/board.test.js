/* global test, fail */
import Board from './board';

const testData = [
  [
    [
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
    { width: 15, height: 15 },
  ],
];

test.each(testData)('board can be filled with words', (words, boardSize) => {
  let board = Board.ofSize(boardSize.width, boardSize.height);

  for (let i = 0; i < words.length; i += 1) {
    const word = words[i];
    const position = board.fits(word);
    if (position === null) {
      fail(`Failed to add word #${i}: ${word}`);
      return;
    }
    board = board.insert(word, position);
  }
});
