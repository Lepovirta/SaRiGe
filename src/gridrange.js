class GridRange {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  * [Symbol.iterator]() {
    for (let i = 0; i < this.y; i += 1) {
      for (let j = 0; j < this.x; j += 1) {
        yield { x: j, y: i };
      }
    }
  }

  substract(l) {
    return new GridRange(this.x - l, this.y - l);
  }

  toGrid(placeholderChar) {
    return Array(this.y).fill('').map(() => Array(this.x).fill(placeholderChar));
  }
}

export default GridRange;
