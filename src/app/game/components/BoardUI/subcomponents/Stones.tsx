import { Position } from '@/app/game/types/Position';
import { useEffect, useState } from 'react';
import { BOARD_SIZE, CONFIG } from '../constants';
import { useCanvasContext } from '../context/CanvasContext';
import { calculateCellSize, calculateStoneSize, getBoardCoordinate } from '../utils/BoardUI.utils';

export type Stone = { position: Position; color: 'white' | 'black' };

const { LINE_WIDTH } = CONFIG;

/** 오목판 위에 돌을 그리는 컴포넌트 */
function Stones({ stones }: { stones: Stone[] }) {
  const { context } = useCanvasContext();
  const [cellSize, setCellSize] = useState(0);
  const stoneSize = calculateStoneSize(cellSize);

  useEffect(() => {
    if (context?.canvas) {
      setCellSize(calculateCellSize(context.canvas.offsetWidth, BOARD_SIZE));
    }
  }, [context]);

  useEffect(() => {
    if (!context) return;
    stones.forEach((stone) => {
      const { position, color } = stone;
      const coord = getBoardCoordinate(position, cellSize);

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
