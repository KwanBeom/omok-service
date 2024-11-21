import { Position } from '@/app/game/types/Position';

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
