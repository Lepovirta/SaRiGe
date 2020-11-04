/* global test, expect */
import * as fits from './fits';

const placeholderChar = '_';
const passingWordFits = [
  ['sauna', 'sauna'],
  ['sauna', '_auna'],
  ['sauna', 's___a'],
  ['sauna', '_____'],
  ['sauna', '__u__'],
  ['sauna', '__u__t'],
];
const failingWordFits = [
  ['sauna', 'pauna'],
  ['sauna', 'saun'],
  ['sauna', '__x__'],
  ['sauna', '__x_a'],
];
const emptyPlaceholders = [
  ['_________'],
  ['_'],
  [''],
];
const nonEmptyPlaceholders = [
  ['____x____'],
  ['_x'],
  ['x'],
];

test.each(passingWordFits)('word %s fits in "%s"', (word, placeholder) => {
  expect(fits.inPlaceholder(word, placeholder, placeholderChar)).toBe(true);
});

test.each(failingWordFits)('word %s does not fit in "%s"', (word, placeholder) => {
  expect(fits.inPlaceholder(word, placeholder, placeholderChar)).toBe(false);
});

test.each(emptyPlaceholders)('placeholder "%s" is empty', (placeholder) => {
  expect(fits.isEmpty(placeholder, placeholderChar)).toBe(true);
});

test.each(nonEmptyPlaceholders)('placeholder "%s" is not empty', (placeholder) => {
  expect(fits.isEmpty(placeholder, placeholderChar)).toBe(false);
});
