import * as array2d from './array2d';
import * as iterators from './iterators';

// String to use a placeholder for empty cells
const placeholderString = '';

export default class Board {
  constructor({
    width,
    height,
    array,
    placements,
  }) {
    this.placeholder = placeholderString;
    this.width = width;
    this.height = height;
    this.array = array;
    this.placements = placements;
  }

  static ofSize(width, height) {
    return new Board({
      width,
      height,
      array: array2d.create(width, height, placeholderString),
      placements: [],
    });
  }

  insert(word, position) {
    const array = [...this.array];
    const overlap = array2d.insert(
      { array, width: this.width },
      { content: word, position },
    );

    return new Board({
      width: this.width,
      height: this.height,
      array,
      placements: [...this.placements, { word, position, overlap }],
    });
  }

  toAscii() {
    return array2d.toAscii(this);
  }

  toRows() {
    return array2d.toRows(this);
  }

  * fitsHorizontally(word) {
    const rowIterator = iterators.dcIterator(this.height);
    let rowResult = rowIterator.next();
    while (!rowResult.done) {
      const columnIterator = iterators.dcIterator(this.width - word.length);
      let columnResult = columnIterator.next();
      while (!columnResult.done) {
        const position = { x: columnResult.value, y: rowResult.value, vertical: false };
        if (array2d.fits(this, { content: word, position })) {
          yield position;
        }
        columnResult = columnIterator.next();
      }
      rowResult = rowIterator.next();
    }
  }

  * fitsVertically(word) {
    const rowIterator = iterators.dcIterator(this.width);
    let rowResult = rowIterator.next();
    while (!rowResult.done) {
      const columnIterator = iterators.dcIterator(this.width - word.length);
      let columnResult = columnIterator.next();
      while (!columnResult.done) {
        const position = { x: rowResult.value, y: columnResult.value, vertical: true };
        if (array2d.fits(this, { content: word, position })) {
          yield position;
        }
        columnResult = columnIterator.next();
      }
      rowResult = rowIterator.next();
    }
  }

  * fits(word) {
    yield* iterators.alternate(
      () => this.fitsHorizontally(word),
      () => this.fitsVertically(word),
    );
  }
}
