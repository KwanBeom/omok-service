import { useEffect } from 'react';
import useCanvas2D from '@/hooks/useCanvas2D';
import { CANVAS, CONFIG, PIXEL_OFFSET } from '../constants';
import styles from '../styles/Background.module.css';
import { calculateSizes } from '../utils/BoardUI.utils';

const { COLOR, LINE_WIDTH, BOARD, RATIO } = CONFIG;

/** 점을 그리는 함수 */
function drawDots(
  context: CanvasRenderingContext2D,
  cellSize: number,
  boardSize: number,
  offset: number,
) {
  const dotsPositions = [
    { x: 3, y: 3 },
    { x: 3, y: 11 },
    { x: 7, y: 7 },
    { x: 11, y: 11 },
    { x: 11, y: 3 },
  ];

  dotsPositions.forEach(({ x, y }) => {
    context.beginPath();
    context.fillStyle = COLOR.DOT;
    context.arc(cellSize * x + offset, cellSize * y + offset, cellSize / boardSize, 0, Math.PI * 2);
    context.fill();
  });

  context.closePath();
}

/** 격자선을 그리는 함수 */
function drawGrid(
  context: CanvasRenderingContext2D,
  cellSize: number,
  boardSize: number,
  offset: number,
) {
  context.strokeStyle = COLOR.BOARD;
  context.lineWidth = LINE_WIDTH.BOARD;

  for (let i = 0; i < boardSize; i += 1) {
    for (let j = 0; j < boardSize; j += 1) {
      context.strokeStyle = COLOR.LINE;
      context.strokeRect(cellSize * i + offset, cellSize * j + offset, cellSize, cellSize);
    }
  }

  context.closePath();
}

/** 오목판 배경 */
function BoardBackground() {
  const { context, canvasRef } = useCanvas2D();

  // 오목판 그리기
  useEffect(() => {
    if (context) {
      const { cellSize } = calculateSizes(context.canvas, BOARD.SIZE, BOARD.PADDING, RATIO);
      context.translate((BOARD.PADDING / 2) * RATIO, (BOARD.PADDING / 2) * RATIO);
      drawGrid(context, cellSize, BOARD.SIZE, PIXEL_OFFSET);
      drawDots(context, cellSize, BOARD.SIZE, PIXEL_OFFSET);
      context.translate((-BOARD.PADDING / 2) * RATIO, (BOARD.PADDING / 2) * RATIO);
    }
  }, [context]);

  return (
    <canvas
      className={styles.background}
      ref={canvasRef}
      width={CANVAS.WIDTH}
      height={CANVAS.HEIGHT}
      style={{ width: CANVAS.WIDTH / RATIO, height: CANVAS.HEIGHT / RATIO }}
    />
  );
}

export default BoardBackground;
