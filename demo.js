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

const startTime = process.hrtime.bigint();
const board = solver(config);
if (!board) {
  console.log('failed to create board');
  process.exit(1);
}
const endTime = process.hrtime.bigint();
const duration = endTime - startTime;
const durationNano = duration % 1000000n;
const durationMs = duration / 1000000n;
const durationSec = durationMs / 1000n;

console.log(board.toAscii());
console.log('\n');
console.log(`Time: ${durationSec}s ${durationMs}ms ${durationNano}ns`);
