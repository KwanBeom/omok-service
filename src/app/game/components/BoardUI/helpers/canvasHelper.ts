import { Position } from '@/src/app/game/types/Position';

/** arc 내부에 X 그리기 */
export const drawXInArc = (
  context: CanvasRenderingContext2D,
  coordinate: Position,
  arcSize: number,
) => {
  const offset = arcSize * 0.7;
  context.moveTo(coordinate.x - offset, coordinate.y - offset);
  context.lineTo(coordinate.x + offset, coordinate.y + offset);
  context.moveTo(coordinate.x + offset, coordinate.y - offset);
  context.lineTo(coordinate.x - offset, coordinate.y + offset);
};

/** 포지션의 중앙에 텍스트 그리기 */
export const writeTextInCenter = (
  context: CanvasRenderingContext2D,
  coordinate: Position,
  fontSize: number,
  string: string,
) => {
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = `${fontSize}px sans-serif`;
  context.fillText(string, coordinate.x, coordinate.y);
};

/** 0-14 index -> canvas 좌표 값으로 변환 */
export const getBoardCoordinate = (
  position: Position,
  cellSize: number,
  boardPadding: number,
): Position => ({
  x: cellSize * position.y + boardPadding,
  y: cellSize * position.x + boardPadding,
});

/* 오목판 줄 긋기 */
