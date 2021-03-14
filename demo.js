import solver from './src/solver';

const config = {
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
  shuffle: true,
  boardSize: { width: 15, height: 15 },
  expectedScore: 0.8,
};

const board = solver(config);
if (!board) {
  console.log('failed to create board');
  process.exit(1);
}

console.log(board.toAscii());
