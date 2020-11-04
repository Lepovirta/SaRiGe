/* global test, expect */
import GridRange from './gridrange';

test('GridRange generates correct positions', () => {
  const grange = new GridRange(3, 4);
  const expectedPositions = [
    { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
    { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
    { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 },
    { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 },
  ];

  const positions = [...grange];

  expect(positions).toEqual(expectedPositions);
});

test('GridRange.substract', () => {
  const grange = new GridRange(3, 4);

  const smallerGrange = grange.substract(2);

  expect(smallerGrange.x).toEqual(1);
  expect(smallerGrange.y).toEqual(2);
});

test('GridRange.toGrid', () => {
  const grange = new GridRange(4, 3);
  const expectedGrid = [
    ['x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x'],
  ];

  const grid = grange.toGrid('x');

  expect(grid).toEqual(expectedGrid);
});
