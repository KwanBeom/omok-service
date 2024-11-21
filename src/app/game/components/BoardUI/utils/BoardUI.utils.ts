import { Position } from '@/app/game/types/Position';

export const positionToString = (position: Position) => `${position.x}.${position.y}`;

/** 0-14 index -> canvas 좌표 값으로 변환 */
export const getBoardCoordinate = (
  position: Position,
  cellSize: number,
  boardPadding: number,
): Position => ({
  x: cellSize * position.y + boardPadding,
  y: cellSize * position.x + boardPadding,
});
