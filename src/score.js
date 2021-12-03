// placements = places where the words are on the board
// max score = 1
// lowest score = 0

import * as iterators from './iterators';

function directionPenalty(board, remainingWords) {
  if (board.placements.length === 0) {
    return 0;
  }

  const maxWords = board.placements.length + remainingWords.length;
  const horizVsVert = board.placements
    .map((p) => (p.position.vertical ? 1 : -1))
    .reduce((acc, n) => acc + n, 0);
  return Math.abs(horizVsVert / maxWords);
}

function placementCenterPoint(placement) {
  const wordCenter = Math.floor(placement.word.length / 2);
  return placement.position.vertical
    ? { x: placement.position.x, y: placement.position.y + wordCenter }
    : { x: placement.position.x + wordCenter, y: placement.position.y };
}

function distance(p1, p2) {
  return Math.sqrt(
    (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2,
  );
}

function densityPenalty(board) {
  if (board.placements.length <= 1) {
    return 0;
  }

  const corners = board.placements.reduce(
    (acc, placement) => {
      const point = placementCenterPoint(placement);
      return {
        min: { x: Math.min(acc.min.x, point.x), y: Math.min(acc.min.y, point.y) },
        max: { x: Math.max(acc.max.x, point.x), y: Math.max(acc.max.y, point.y) },
      };
    },
    {
      min: { x: board.width, y: board.height },
      max: { x: 0, y: 0 },
    },
  );

  const maxDistance = distance({ x: 0, y: 0 }, { x: board.width, y: board.height });

  const comparisonPoints = [
    [{ x: 0, y: 0 }, corners.min],
    [{ x: board.width, y: board.height }, corners.max],
    [{ x: 0, y: board.height }, { x: corners.min.x, y: corners.max.y }],
    [{ x: board.width, y: 0 }, { x: corners.max.x, y: corners.min.y }],
  ];

  const avgDistance = comparisonPoints.reduce(
    (acc, [p1, p2]) => acc + distance(p1, p2),
    0,
  ) / comparisonPoints.length;

  return avgDistance / maxDistance;
}

function wordDistancePenalty(board) {
  if (board.placements.length <= 3) {
    return 0;
  }

  const maxDistance = distance({ x: 0, y: 0 }, { x: board.width, y: board.height });
  const positions = board.placements.map((p) => placementCenterPoint(p));

  let count = 0;
  let distanceSum = 0;

  const combinations = iterators.combinations(positions);
  let combination = combinations.next();
  while (!combination.done) {
    count += 1;
    const [p1, p2] = combination.value;
    distanceSum += distance(p1, p2);
    combination = combinations.next();
  }

  return 1 - distanceSum / count / maxDistance;
}

function wordNeighbourPenalty(board) {
  if (board.placements.length === 0) {
    return 0;
  }

  let count = 0;
  let penalty = 0;

  const combinations = iterators.combinations(board.placements);
  let combination = combinations.next();
  while (!combination.done) {
    count += 1;
    const [p1, p2] = combination.value;
    const weight = p1.position.vertical === p2.position.vertical
      ? 1
      : 0.5;
    const pos1 = p1.position.vertical ? p1.position.x : p1.position.y;
    const pos2 = p2.position.vertical ? p2.position.x : p2.position.y;
    penalty += (Math.abs(pos1 - pos2) === 1 ? 1 : 0) * weight;
    combination = combinations.next();
  }

  return penalty / count;
}

function multipleWordsOnSameLinePenalty(board) {
  if (board.placements.length === 0) {
    return 0;
  }

  const columns = {};
  const rows = {};

  for (let i = 0; i < board.placements.length; i += 1) {
    const placement = board.placements[i];
    if (placement.position.vertical) {
      columns[placement.position.x] = (columns[placement.position.x] || 0) + 1;
    } else {
      rows[placement.position.y] = (rows[placement.position.y] || 0) + 1;
    }
  }

  const count = [rows, columns].map(
    (collection) => Object.values(collection).reduce(
      (acc, c) => acc + (c > 1 ? c : 0),
      0,
    ),
  ).reduce((acc, c) => acc + c, 0);

  return count / board.placements.length;
}

function between(start, n, end) {
  return n >= start && n <= end;
}

function sharedLettersPenalty(board) {
  if (board.placements.length <= 3) {
    return 0;
  }

  const totalWords = board.placements.length;
  const totalOverlap = board.placements.reduce(
    (acc, p) => acc + p.overlap,
    0,
  );

  if (between(0.45 * totalWords, totalOverlap, 0.65 * totalWords)) {
    return 0;
  }
  if (
    between(0.25 * totalWords, totalOverlap, 0.45 * totalWords)
    || between(0.65 * totalWords, totalOverlap, 0.85 * totalWords)
  ) {
    return 0.25;
  }
  if (
    between(0, totalOverlap, 0.25 * totalWords)
    || between(0.85 * totalWords, totalOverlap, totalWords)
  ) {
    return 0.5;
  }

  return 0.75;
}

// All of the score penalty calculators.
// The penalties are calculated in the list order,
// which means that heavy-weight calculators should be
// placed at the end of the list.
const scoreCalculators = [
  {
    name: 'direction',
    execute: directionPenalty,
    weight: 0.2,
  },
  {
    name: 'density',
    execute: densityPenalty,
    weight: 0.2,
  },
  {
    name: 'sharedLetters',
    execute: sharedLettersPenalty,
    weight: 0.1,
  },
  {
    name: 'multipleWordsOnSameLine',
    execute: multipleWordsOnSameLinePenalty,
    weight: 0.2,
  },
  {
    name: 'wordNeighbour',
    execute: wordNeighbourPenalty,
    weight: 0.2,
  },
  {
    name: 'wordDistance',
    execute: wordDistancePenalty,
    weight: 0.1,
  },
];

export function calculate(expectedScore, board, remainingWords) {
  const result = {
    penalties: {},
    score: 1,
    fails: false,
  };

  for (let i = 0; i < scoreCalculators.length; i += 1) {
    const calculator = scoreCalculators[i];
    const penalty = calculator.execute(board, remainingWords) * calculator.weight;
    result[calculator.name] = penalty;
    result.score -= penalty;

    if (expectedScore > result.score) {
      // Since the penalties only substract the score,
      // we can skip the rest of the penalty calculations
      // after the score goes below the expected value.
      result.fails = true;
      break;
    }
  }

  return result;
}

export function empty() {
  return {
    penalties: {},
    score: 0,
    fails: false,
  };
}
