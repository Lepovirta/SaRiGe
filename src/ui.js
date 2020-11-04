function byId(id) {
  return window.document.getElementById(id);
}

export function setOptions(options) {
  byId('fillerLetters').value = options.fillerLetters;
  byId('gridSizeX').value = options.gridSize.x;
  byId('gridSizeY').value = options.gridSize.y;
  byId('words').value = options.words.join('\n');
}

function getWords() {
  return byId('words').value.toLowerCase().replace(' ', '\n').split('\n');
}

function parseInt(s) {
  return Math.floor(Number.parseInt(s, 10));
}

function readOptions() {
  const gridSizeX = byId('gridSizeX');
  const gridSizeY = byId('gridSizeY');

  if (gridSizeX.validity.typeMismatch || gridSizeY.validity.typeMismatch) {
    throw new Error('Grid size must be provided as numbers');
  }

  if (gridSizeX.validity.rangeUnderflow || gridSizeY.validity.rangeUnderflow) {
    throw new Error(`Grid size is too small. Min size: ${gridSizeX.min}x${gridSizeY.min}`);
  }

  if (gridSizeX.validity.rangeOverflow || gridSizeY.validity.rangeOverflow) {
    throw new Error(`Grid size is too large. Max size: ${gridSizeX.max}x${gridSizeY.max}`);
  }

  return {
    fillerLetters: byId('fillerLetters').value.toLowerCase(),
    gridSize: {
      x: parseInt(gridSizeX.value),
      y: parseInt(gridSizeY.value),
    },
    words: getWords(),
  };
}

function showElement(element) {
  element.classList.remove('hidden');
}

function hideElement(element) {
  element.classList.add('hidden');
}

function setErrorMessage(message) {
  const element = byId('errorMessage');
  if (message) {
    showElement(element);
    element.innerText = message;
  } else {
    hideElement(element);
  }
}

function fillGrid(grid) {
  const table = byId('grid');
  table.innerHTML = '';
  const tbody = document.createElement('tbody');
  grid.grid.forEach((row) => {
    const tr = document.createElement('tr');
    tbody.appendChild(tr);
    row.forEach((column) => {
      const td = document.createElement('td');
      td.innerText = column;
      tr.appendChild(td);
    });
  });
  table.appendChild(tbody);
}

function fillAnswers() {
  const words = getWords();
  const ul = byId('answers');
  ul.innerHTML = '';
  words.forEach((word) => {
    const li = document.createElement('li');
    li.innerText = word;
    ul.appendChild(li);
  });
}

function fillResults(grid) {
  showElement(byId('results'));
  fillGrid(grid);
  fillAnswers();
}

export function setup(generateGrid) {
  byId('triggerGenerate').addEventListener('click', (e) => {
    e.preventDefault();
    setErrorMessage();
    try {
      const grid = generateGrid(readOptions());
      fillResults(grid);
      fillGrid(grid);
      fillAnswers();
    } catch (err) {
      const message = err.message || err;
      setErrorMessage(message);
    }
  });
}
