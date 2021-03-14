// Iterates numbers from 0 to the given end starting from the middle.
export function* middleIterator(end) {
  // even = start just before middle
  // odd  = start on middle
  const startIndex = end % 2 === 0
    ? end / 2 - 1
    : Math.floor(end / 2);

  for (let i = startIndex; i >= 0; i -= 1) {
    const nextIndex = (i + 1) % end;
    const prevIndex = (end - i) % end;
    yield nextIndex;
    if (nextIndex !== prevIndex) {
      yield prevIndex;
    }
  }
}

// Creates unique combinations from given items
export function* combinations(items) {
  const hashes = new Set();

  function hash(a, b) {
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    return min * items.length + max;
  }

  for (let i = 0; i < items.length; i += 1) {
    for (let j = 0; j < items.length; j += 1) {
      const h = hash(i, j);
      if (i !== j && !hashes.has(h)) {
        yield [items[i], items[j]];
        hashes.add(h);
      }
    }
  }
}
