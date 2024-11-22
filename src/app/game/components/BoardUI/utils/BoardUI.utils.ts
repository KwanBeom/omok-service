import { Position } from '@/app/game/types/Position';

export const positionToString = (position: Position) => `${position.x}.${position.y}`;

/** 오목 요소F 사이즈 계산 */
export const calculateSizes = (
  canvas: HTMLCanvasElement,
  boardSize: number,
  boardPadding: number,
  ratio: number = 1,
): { cellSize: number; stoneSize: number } => {
  const cellSize = ((canvas.offsetWidth - boardPadding) / boardSize) * ratio;
  const stoneSize = cellSize * 0.45;
  return { cellSize, stoneSize };
};
