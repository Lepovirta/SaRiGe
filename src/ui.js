function randomInteger(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomElement(l) {
  return l[randomInteger(l.length)];
}

function byId(id) {
  return window.document.getElementById(id);
}

export function setOptions(options) {
  byId('fillerLetters').value = options.fillerLetters;
  byId('boardSizeWidth').value = options.boardSize.width;
  byId('boardSizeHeight').value = options.boardSize.height;
  byId('words').value = options.allWords.join('\n');
}

function getWords() {
  return byId('words').value.toLowerCase().replace(' ', '\n').split('\n');
}

function parseInt(s) {
  return Math.floor(Number.parseInt(s, 10));
}

function readOptions() {
  const boardSizeWidth = byId('boardSizeWidth');
  const boardSizeHeight = byId('boardSizeHeight');

  if (boardSizeWidth.validity.typeMismatch || boardSizeHeight.validity.typeMismatch) {
    throw new Error('Board size must be provided as numbers');
  }

  if (boardSizeWidth.validity.rangeUnderflow || boardSizeHeight.validity.rangeUnderflow) {
    throw new Error(`Board size is too small. Min size: ${boardSizeWidth.min}x${boardSizeHeight.min}`);
  }

  if (boardSizeWidth.validity.rangeOverflow || boardSizeHeight.validity.rangeOverflow) {
    throw new Error(`Board size is too large. Max size: ${boardSizeWidth.max}x${boardSizeHeight.max}`);
  }

  return {
    fillerLetters: byId('fillerLetters').value.toLowerCase(),
    boardSize: {
      width: parseInt(boardSizeWidth.value),
      height: parseInt(boardSizeHeight.value),
    },
    allWords: getWords(),
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

function fillBoard(options, board) {
  const table = byId('board');
  table.innerHTML = '';
  const tbody = document.createElement('tbody');
  board.toRows().forEach((row) => {
    const tr = document.createElement('tr');
    tbody.appendChild(tr);
    row.forEach((column) => {
      const td = document.createElement('td');
      if (column) {
        td.classList.add('solutionchar');
        td.innerText = column;
      } else {
        td.innerText = randomElement(options.fillerLetters);
      }
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

function fillResults(options, board) {
  showElement(byId('results'));
  fillBoard(options, board);
  fillAnswers();
}

function toggleBodyClass(show, className) {
  if (show) {
    document.body.classList.add(className);
  } else {
    document.body.classList.remove(className);
  }
}

function toggleAdvancedControls(e) {
  toggleBodyClass(!e.target.checked, 'hideadvanced');
}

function toggleBorders(e) {
  toggleBodyClass(e.target.checked, 'showborders');
}

function toggleHints(e) {
  toggleBodyClass(e.target.checked, 'showhints');
}

export function setup(generateBoard) {
  byId('toggleAdvanced').addEventListener('change', toggleAdvancedControls);
  byId('toggleBorders').addEventListener('change', toggleBorders);
  byId('toggleHints').addEventListener('change', toggleHints);
  byId('triggerGenerate').addEventListener('click', (e) => {
    e.preventDefault();
    setErrorMessage();
    try {
      showElement(byId('spinner'));
      const options = readOptions();
      const board = generateBoard(options);
      hideElement(byId('spinner'));
      fillResults(options, board);
    } catch (err) {
      const message = err.message || err;
      console.log(err);
      setErrorMessage(message);
    }
  });
}
