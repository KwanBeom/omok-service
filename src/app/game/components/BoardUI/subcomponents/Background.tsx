import { useEffect } from 'react';
import { BOARD_SIZE, CONFIG, PIXEL_OFFSET } from '../constants';
import { getDotPositions } from '../utils/BoardUI.utils';
import { useCanvasContext } from '../context/CanvasContext';
import useCellSize from '../hooks/useCellSize';

const { COLOR, LINE_WIDTH } = CONFIG;

/** 점을 그리는 함수 */
function drawDots(context: CanvasRenderingContext2D, cellSize: number, boardSize: number) {
  const dots = getDotPositions(BOARD_SIZE);

  dots.forEach(({ x, y }) => {
    context.beginPath();
    context.fillStyle = COLOR.DOT;
    context.arc(cellSize * x, cellSize * y, cellSize / boardSize, 0, Math.PI * 2);
    context.fill();
  });
}

/** 격자선을 그리는 함수 */
function drawGrid(context: CanvasRenderingContext2D, cellSize: number, boardSize: number) {
  context.strokeStyle = COLOR.BOARD;
  context.lineWidth = LINE_WIDTH.BOARD;

  for (let i = 0; i < boardSize; i += 1) {
    for (let j = 0; j < boardSize; j += 1) {
      context.strokeStyle = COLOR.LINE;
      context.strokeRect(cellSize * i, cellSize * j, cellSize, cellSize);
    }
  }
}

/** 오목판 배경 */
function BoardBackground() {
  const { canvasRef, context } = useCanvasContext();
  const canvas = canvasRef.current;
  const cellSize = useCellSize(canvas, BOARD_SIZE, PIXEL_OFFSET);

  // 오목판 그리기
  useEffect(() => {
    if (context && cellSize > 0) {
      drawGrid(context, cellSize, BOARD_SIZE);
      drawDots(context, cellSize, BOARD_SIZE);
    }
  }, [cellSize, context]);

  return null;
}

export default BoardBackground;
