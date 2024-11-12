import { Position } from '@/app/game/types/Position';

/** 셀 사이즈 계산 */
export const calculateCellSize = (canvasSize: number, boardSize: number) =>
  (canvasSize / boardSize) * 2;

/** 오목돌 사이즈 계산 */
export const calculateStoneSize = (cellSize: number) => cellSize * 0.45;

/** 보드 위 점 위치 반환 */
export const getDotPositions = (boardSize: number): Position[] => {
  const mid = Math.floor(boardSize / 2);
  const offset = Math.floor(boardSize / 4);

  return [
    { x: offset, y: offset },
    { x: offset, y: boardSize - offset },
    { x: mid, y: mid },
    { x: boardSize - offset, y: offset },
    { x: boardSize - offset, y: boardSize - offset },
  ];
};

export const positionToString = (position: Position) => `${position.x}.${position.y}`;

/** 0-14 사이 포지션 인덱스로 canvas board UI 좌표 값으로 변환 */
export const getBoardCoordinate = (position: Position, cellSize: number): Position => ({
  x: cellSize * position.y,
  y: cellSize * position.x,
});

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
