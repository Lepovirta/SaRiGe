// placements = places where the words are on the board
// max score = 1
// lowest score = 0

import * as iterators from './iterators';

// Compares the ratio of words arranged in different directions.
// The less balanced the ratio is the more penalty is involved.
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

// Distance between two points.
function distance(p1, p2) {
  return Math.sqrt(
    (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2,
  );
}

// Calculate how densely words are packed in a board.
// More density = more penalty.
// This is to ensure that words are spread around the board as wide as possible.
function densityPenalty(board) {
  if (board.placements.length <= 1) {
    return 0;
  }

  // Get the outermost points of the words from the center of the board.
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

  // Calculate the distances between board corners and outermost points,
  // and take average of them. The higher the average distance, the more
  // density there is, which means more penalty.
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

// Calculate how far apart words on the board are from each other.
// Less distance = more penalty.
// This is to ensure that words are spread around the board as wide as possible.
//
// Since this requires comparing each word to each other, this is more compute
// intensive compared to the other penalty calculators. For this reason, this
// calculator should be used as the last one.
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

  const avgDistance = distanceSum / count;
  return 1 - avgDistance / maxDistance;
}

// Calculate the number of "neighbours" each word on the board has.
// A neighbour = a word that's placed on the next row/column to another word.
// More neighbours found = more penalty.
//
// Since this requires comparing each word to each other, this is more compute
// intensive compared to the other penalty calculators. For this reason, this
// calculator should be used as the last one.
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

// Calculate the number of words each row and column have on the board.
// The more words on the same row/column = more penalty.
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

  // Max penalty reached when more than half of the words share rows/columns.
  const max = board.placements.length / 2;
  return Math.min(count / max, 1);
}

// Check if `n` is between `start` and `end`.
function between(start, n, end) {
  return n >= start && n <= end;
}

// Calculate the number of shared letters on the board.
//
// Penalty is based on the percentage of words that use shared letters:
//  0 -  25% = 50% penalty
// 25 -  45% = 25% penalty
// 45 -  65% =  0% penalty
// 65 -  85% = 25% penalty
// 85 - 100% = 50% penalty
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
//
// The weight is used for balancing the impact of the
// penalties between each other. The total weight must
// equal to 1.0.
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
    weight: 0.2,
  },
  {
    name: 'multipleWordsOnSameLine',
    execute: multipleWordsOnSameLinePenalty,
    weight: 0.2,
  },
  {
    name: 'wordNeighbour',
    execute: wordNeighbourPenalty,
    weight: 0.1,
  },
  {
    name: 'wordDistance',
    execute: wordDistancePenalty,
    weight: 0.1,
  },
];

// Calculate the total score for the board and remaining words,
// and compare it to the expected score. The score calculation
// ends early, if it goes below the expected score.
export function calculate(expectedScore, board, remainingWords) {
  const result = {
    penalties: {},
    score: 1,
    fails: false,
  };

  for (let i = 0; i < scoreCalculators.length; i += 1) {
    const calculator = scoreCalculators[i];
    const penalty = calculator.weight === 0
      ? 0
      : calculator.execute(board, remainingWords) * calculator.weight;
    result.penalties[calculator.name] = penalty;
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

// Empty score recording. Used as a placeholder value.
export function empty() {
  return {
    penalties: {},
    score: 0,
    fails: false,
  };
}
