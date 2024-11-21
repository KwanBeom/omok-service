import { useEffect } from 'react';
import { Position } from '@/app/game/types/Position';
import { CONFIG } from '../constants';
import { useCanvasContext } from '../contexts/CanvasContext';
import { getBoardCoordinate } from '../utils/BoardUI.utils';
import useCellSize from '../hooks/useCellSize';

export type Stone = { position: Position; color: 'white' | 'black' };

const { LINE_WIDTH, BOARD, RATIO } = CONFIG;

/** 오목판 위에 돌을 그리는 컴포넌트 */
function Stones({ stones }: { stones: Stone[] }) {
  const { canvasRef, context } = useCanvasContext();
  const cellSize = useCellSize(canvasRef.current, BOARD.SIZE, BOARD.PADDING) * RATIO;
  const stoneSize = cellSize * 0.45;

  useEffect(() => {
    if (!context) return;

    stones.forEach((stone) => {
      const { position, color } = stone;
      const coord = getBoardCoordinate(position, cellSize, BOARD.PADDING);

      context.lineWidth = LINE_WIDTH.STONE;
      context.beginPath();
      context.fillStyle = color;
      context.arc(coord.x, coord.y, stoneSize, 0, Math.PI * 2);
      context.fill();
    });
  }, [stones, context, cellSize, stoneSize]);

  return null;
}

export default Stones;
