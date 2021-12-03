import Board from './board';
import * as score from './score';

// Fisher-Yates shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * i);
    const v = array[i];
    array[i] = array[j];
    array[j] = v;
  }
  return array;
}

// Create a board from all the given words that has
// at least as high of a score as specified.
export default function solver({
  allWords,
  expectedScore,
  boardSize,
  shuffle,
}) {
  // stack of all the work in progress boards
  const stack = [{
    board: Board.ofSize(boardSize.width, boardSize.height),
    placements: null,
    words: shuffle ? shuffleArray([...allWords]) : allWords,
    score: score.empty(),
  }];

  function handleStep(step) {
    // score is too low, skip the step entirely
    if (step.score.fails) {
      return null;
    }

    // no words left? the board should be good enough
    if (!step.words.length) {
      return step;
    }

    // split the words list
    const [nextWord, ...remainingWords] = step.words;

    // no placements generated yet?
    // generate it for the next word
    if (!step.placements) {
      stack.push({
        ...step,
        placements: step.board.fits(nextWord),
      });
      return null;
    }

    // get the next position from the available placements
    const result = step.placements.next();
    if (result.done) {
      // no more placements available? drop it
      return null;
    }

    // Push the step back in for further processing later.
    // The placements iterator has been mutated in place
    // so the processing can continue.
    stack.push(step);

    // Insert the next word to the board, and continue processing from there.
    const nextBoard = step.board.insert(nextWord, result.value);
    stack.push({
      board: nextBoard,
      words: remainingWords,
      score: score.calculate(expectedScore, nextBoard, remainingWords),
    });

    return null;
  }

  while (stack.length) {
    const step = stack.pop();
    const result = handleStep(step);
    if (result !== null) {
      return result.board;
    }
  }

  // no solution found
  return null;
}
