// Iterates numbers from 0 to the given end in a divide and conquer manner.
// Iteration starts from the middle and descends recursively to the
// bottom and top half from the middle.
export function* dcIterator(end) {
  const stack = [[0, end - 1]];
  while (stack.length) {
    const [from, to] = stack.shift();
    if (to < from) {
      // wrap around = nop
    } else if (to === from) {
      yield from;
    } else {
      const e = to - from;
      const middle = Math.floor(e / 2) + from;
      yield middle;

      if (e > 0) {
        stack.push([from, middle - 1]);
        stack.push([middle + 1, to]);
      }
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

export function* alternate(first, second) {
  const iter1 = first();
  const iter2 = second();

  let res1 = iter1.next();
  let res2 = iter2.next();
  while (!(res1.done && res2.done)) {
    if (!res1.done) {
      yield res1.value;
      res1 = iter1.next();
    }
    if (!res2.done) {
      yield res2.value;
      res2 = iter2.next();
    }
  }
}
