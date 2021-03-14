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
  const combinations = [...iterators.combinations(positions)];
  const distanceSum = combinations.reduce(
    (acc, [p1, p2]) => acc + distance(p1, p2),
    0,
  );
  return 1 - distanceSum / combinations.length / maxDistance;
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

export default function score(board, remainingWords) {
  const totalWeigth = 100;
  const penalties = [
    directionPenalty(board, remainingWords) * 30,
    densityPenalty(board) * 40,
    wordDistancePenalty(board) * 20,
    sharedLettersPenalty(board) * 10,
  ];
  return penalties.reduce((acc, p) => acc - p, totalWeigth) / totalWeigth;
}
