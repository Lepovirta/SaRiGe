export function inPlaceholder(s, placeholder, placeholderChar) {
  return [...s].every(
    (char, index) => placeholder[index] === placeholderChar || char === placeholder[index],
  );
}

export function isEmpty(placeholder, placeholderChar) {
  return [...placeholder].every((char) => char === placeholderChar);
}
