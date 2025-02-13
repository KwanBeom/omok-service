/* eslint-disable import/prefer-default-export */
import { Position } from '@/src/app/game/types/Position';

export const isPositionIncluded = (positions: Position[], position: Position) =>
  positions.some(({ x, y }) => position.x === x && y === position.y);
