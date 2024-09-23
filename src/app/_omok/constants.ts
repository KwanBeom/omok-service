import { createDirection } from './utils';

export const DIRECTIONS = [
  createDirection(1, 0),
  createDirection(0, 1),
  createDirection(-1, 0),
  createDirection(0, -1),
  createDirection(1, 1),
  createDirection(1, -1),
  createDirection(-1, 1),
  createDirection(-1, -1),
];

export const HALF_DIRECTIONS = [
  createDirection(1, 0), // 우
  createDirection(0, 1), // 상
  createDirection(1, 1), // 우상 대각
  createDirection(1, -1), // 우하 대각
];
