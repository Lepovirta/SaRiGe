// A word puzzle board can be represented as a two-dimensional array of characters.
// Instead of using arrays within arrays, the board is represented as one continuous array.
//
// Position in the array can be calculated as follows:
//   width * y + x, where x and y are the coordinates of the character
//

export function create(width, height, placeholder) {
  return Array(width * height).fill(placeholder);
}

export function relativePositionToIndex(width, { x, y, vertical }) {
  if (vertical) {
    return (i) => (width * (y + i)) + x;
  }
  return (i) => (width * y) + x + i;
}

export function insert({ array, width }, { content, position }) {
  let overlap = 0;
  const getIndex = relativePositionToIndex(width, position);
  for (let i = 0; i < content.length; i += 1) {
    const index = getIndex(i);
    if (array[index] === content[i]) {
      overlap += 1;
    }
    array[index] = content[i];
  }
  return overlap;
}

export function toRows({
  array, width, height,
}) {
  const rows = [];
  for (let lineNr = 0; lineNr < height; lineNr += 1) {
    const start = lineNr * width;
    const end = lineNr * width + width;
    rows.push(array.slice(start, end));
  }
  return rows;
}

export function toAscii({
  array, width, height, placeholder,
}) {
  const rowToStr = (row) => row.map(
    (col) => (col === placeholder ? '-' : col),
  ).join('');

  return toRows({ array, width, height })
    .map(rowToStr)
    .join('\n');
}

export function fits(
  {
    array, width, height, placeholder,
  },
  { content, position },
) {
  const maxSize = width * height;
  const getIndex = relativePositionToIndex(width, position);
  let previouslyOverlapped = false;

  for (let i = 0; i < content.length; i += 1) {
    const index = getIndex(i);

    // out of bounds
    if (index >= maxSize) {
      return false;
    }

    // check character used in the array at index
    if (array[index] === placeholder) {
      previouslyOverlapped = false;
    } else if (array[index] === content[i]) {
      // If the content overlaps with array characters more than once in a row,
      // then there's a chance that the content would get fully or partially hidden
      // by existing content. This would make it really or even impossible to later
      // distinguish the content in the array, which is why it must be rejected.
      if (previouslyOverlapped) {
        return false;
      }
      previouslyOverlapped = true;
    } else {
      return false;
    }
  }

  return true;
}
