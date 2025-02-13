import { useEffect } from 'react';
import useCanvas2D from '@/src/hooks/useCanvas2D';
import { useCanvasContext } from '@/src/app/game/contexts/CanvasContext';
import { CONFIG, PIXEL_OFFSET } from '../constants';
import styles from '../styles/BoardUI.module.css';
import { calculateSizes } from '../utils/BoardUI.utils';

const { COLOR, LINE_WIDTH, BOARD, RATIO } = CONFIG;

/** 점 그리기 함수 */
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

/** 선 그리기 함수 */
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
  const { canvasSize, boardPadding } = useCanvasContext();

  // 오목판 그리기
  useEffect(() => {
    if (context && canvasRef.current && canvasSize && boardPadding) {
      const { cellSize } = calculateSizes(
        canvasRef.current.offsetWidth,
        BOARD.SIZE,
        boardPadding,
        RATIO,
      );

      context.translate((boardPadding / 2) * RATIO, (boardPadding / 2) * RATIO);
      drawGrid(context, cellSize, BOARD.SIZE, PIXEL_OFFSET);
      drawDots(context, cellSize, BOARD.SIZE, PIXEL_OFFSET);
      context.translate((-boardPadding / 2) * RATIO, (boardPadding / 2) * RATIO);
    }
  }, [context, canvasSize, boardPadding, canvasRef]);

  return (
    <canvas
      className={styles.background}
      ref={canvasRef}
      width={canvasSize}
      height={canvasSize}
      style={{ width: canvasSize / RATIO, height: canvasSize / RATIO }}
    />
  );
}

export default BoardBackground;
