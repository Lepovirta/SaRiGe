import solver from './src/solver';
import defaultOptions from './src/defaults';

const startTime = process.hrtime.bigint();
const board = solver(defaultOptions);
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
