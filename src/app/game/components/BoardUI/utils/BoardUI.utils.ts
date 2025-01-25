import { Position } from '@/app/game/types/Position';

export const positionToString = (position: Position) => `${position.x}.${position.y}`;

/** 오목 요소 사이즈 계산 */
export const calculateSizes = (
  canvasOffsetWidth: number,
  boardSize: number,
  boardPadding: number,
  ratio: number = 1,
): { cellSize: number; stoneSize: number } => {
  const cellSize = ((canvasOffsetWidth - boardPadding) / boardSize) * ratio;
  const stoneSize = cellSize * 0.45;
  return { cellSize, stoneSize };
};

/* board 내부 좌표인지 확인하는 함수 */
export const isValidPosition = (position: Position, boardSize: number): boolean =>
  position.x >= 0 && position.x <= boardSize && position.y >= 0 && position.y <= boardSize;
