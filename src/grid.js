import * as fits from './fits';

const placeholderChar = ' ';

export function NoCandidatesError(word) {
  this.name = 'NoCandidatesError';
  this.message = `No more places to place the word ${word} on grid.`;
}
NoCandidatesError.prototype = Error.prototype;

function randomInteger(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomElement(l) {
  return l[randomInteger(l.length)];
}

export class Grid {
  constructor(gridRange, overlapWeight) {
    this.gridRange = gridRange;
    this.grid = gridRange.toGrid(placeholderChar);
    this.overlapWeight = overlapWeight;
    this.answerPositions = [];
  }

  getRow({ x, y }) {
    return this.grid[y].slice(x);
  }

  getColumn({ x, y }) {
    return this.grid.map((row) => row[x]).slice(y);
  }

  fitsInPosition(word, position) {
    const c = [];
    const row = this.getRow(position);
    const column = this.getColumn(position);

    function pushWithWeight(o, weight) {
      for (let i = 0; i < weight; i += 1) {
        c.push(o);
      }
    }

    if (fits.isEmpty(row.slice(0, word.length), placeholderChar)) {
      pushWithWeight({ isVertical: false, position }, 1);
    } else if (fits.inPlaceholder(word, row, placeholderChar)) {
      pushWithWeight({ isVertical: false, position }, this.overlapWeight);
    }

    if (fits.isEmpty(column.slice(0, word.length), placeholderChar)) {
      pushWithWeight({ isVertical: true, position }, 1);
    } else if (fits.inPlaceholder(word, column, placeholderChar)) {
      pushWithWeight({ isVertical: true, position }, this.overlapWeight);
    }

    return c;
  }

  fillOneWordHorizontally(word, { x, y }) {
    const row = this.grid[y];
    [...word].forEach((char, index) => {
      row[x + index] = char;
      this.answerPositions.push({ x: x + index, y });
    });
  }

  fillOneWordVertically(word, { x, y }) {
    [...word].forEach((char, index) => {
      this.grid[y + index][x] = char;
      this.answerPositions.push({ x, y: y + index });
    });
  }

  fillOneWord(word, { isVertical, position }) {
    if (isVertical) {
      return this.fillOneWordVertically(word, position);
    }
    return this.fillOneWordHorizontally(word, position);
  }

  fillOneWordRandomly(word) {
    const candidates = [...this.gridRange.substract(word.length)]
      .flatMap((position) => this.fitsInPosition(word, position));
    if (candidates.length === 0) {
      throw new NoCandidatesError(word);
    }
    this.fillOneWord(word, randomElement(candidates));
  }

  fillWordsRandomly(words) {
    words.forEach((word) => this.fillOneWordRandomly(word));
  }

  fillEmptySpots(fillerLetters) {
    for (let y = 0; y < this.grid.length; y += 1) {
      const row = this.grid[y];
      for (let x = 0; x < row.length; x += 1) {
        if (row[x] === placeholderChar) {
          row[x] = randomElement(fillerLetters);
        }
      }
    }
  }
}
