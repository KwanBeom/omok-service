import { useEffect } from 'react';
import Position from '@/app/_omok/entities/Position';
import { useCanvasContext } from '../context/CanvasContext';
import { BOARD_SIZE, CONFIG, PIXEL_OFFSET } from '../constants';
import useCellSize from '../hooks/useCellSize';
import { drawXInArc, getBoardCoordinate, writeTextInCenter } from '../utils/BoardUI.utils';

const { COLOR, LINE_WIDTH } = CONFIG;

export type Geumsu = { position: Position; type: '33' | '44' | '6+' };

/** 오목판 위 금수 UI를 그리는 컴포넌트 */
function GeumsuOverlay({ geumsu }: { geumsu: Geumsu[] }) {
  const { canvasRef, context } = useCanvasContext();
  const canvas = canvasRef.current;
  const cellSize = useCellSize(canvas, BOARD_SIZE, PIXEL_OFFSET);
  const fontSize = cellSize * 0.45;
  const stoneSize = cellSize * 0.45;

  useEffect(() => {
    if (!context) return;

    for (let i = 0; i < geumsu.length; i += 1) {
      const { position, type } = geumsu[i];
      const coord = getBoardCoordinate(position, cellSize);

      context.beginPath();
      context.arc(coord.x, coord.y, stoneSize, 0, Math.PI * 2);
      context.strokeStyle = COLOR.GEUMSU;
      context.fillStyle = COLOR.GEUMSU;
      context.lineWidth = LINE_WIDTH.GEUMSU;
      writeTextInCenter(context, coord, fontSize, type);
      drawXInArc(context, coord, stoneSize);
      context.stroke();
      context.closePath();
    }
  }, [geumsu, context, cellSize, fontSize, stoneSize]);

  return null;
}

export default GeumsuOverlay;
