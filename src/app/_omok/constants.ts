import Direction from './entities/Direction';

export const DIRECTIONS = [
  new Direction(1, 0),
  new Direction(0, 1),
  new Direction(-1, 0),
  new Direction(0, -1),
  new Direction(1, 1),
  new Direction(1, -1),
  new Direction(-1, 1),
  new Direction(-1, -1),
];

export const HALF_DIRECTIONS = [
  new Direction(1, 0), // 우
  new Direction(0, 1), // 상
  new Direction(1, 1), // 우상 대각
  new Direction(1, -1), // 우하 대각
];
