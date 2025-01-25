import { useEffect } from 'react';
import { Position } from '@/app/game/types/Position';
import { STONE } from '@/app/game/types/Stone';
import { CONFIG } from '../constants';
import { useCanvasContext } from '../../../contexts/CanvasContext';
import { calculateSizes } from '../utils/BoardUI.utils';
import { getBoardCoordinate } from '../helpers/canvasHelper';

export type Stone = { position: Position; color: STONE };

const { LINE_WIDTH, BOARD, RATIO } = CONFIG;

/** 오목판 위에 돌을 그리는 컴포넌트 */
function Stones({ stones }: { stones: Stone[] }) {
  const { context, boardPadding } = useCanvasContext();

  useEffect(() => {
    if (!context) return;

    const { cellSize, stoneSize } = calculateSizes(
      context.canvas.offsetWidth,
      BOARD.SIZE,
      boardPadding,
      RATIO,
    );

    // stones 배열을 순회하면서 돌을 그리기
    stones.forEach((stone) => {
      const { position, color } = stone;
      const coord = getBoardCoordinate(position, cellSize, boardPadding);
      context.lineWidth = LINE_WIDTH.STONE;
      context.beginPath();
      context.fillStyle = color === 1 ? 'black' : 'white';
      context.arc(coord.x, coord.y, stoneSize, 0, Math.PI * 2);
      context.fill();
    });
  }, [stones, context, boardPadding]);

  return null;
}

export default Stones;
