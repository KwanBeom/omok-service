import { useEffect, useState } from 'react';
import Position from '@/app/_omok/entities/Position';
import { useCanvasContext } from '../contexts/CanvasContext';
import { CONFIG, PIXEL_OFFSET } from '../constants';
import { calculateSizes } from '../utils/BoardUI.utils';
import { drawXInArc, getBoardCoordinate, writeTextInCenter } from '../helpers/canvasHelper';

const { COLOR, LINE_WIDTH, BOARD, RATIO } = CONFIG;

export type Geumsu = { position: Position; type: '33' | '44' | '6+' };

/** 오목판 위 금수 UI를 그리는 컴포넌트 */
function GeumsuOverlay({ geumsu, turn }: { geumsu: Geumsu[]; turn: 'black' | 'white' }) {
  const [prev, setPrev] = useState<Position[]>([]);
  const { context } = useCanvasContext();

  // 금수 UI 그리기
  useEffect(() => {
    const drawGeumsu = (positions: Geumsu[]) => {
      if (!context) return;
      const { cellSize, stoneSize } = calculateSizes(
        context.canvas,
        BOARD.SIZE,
        BOARD.PADDING,
        RATIO,
      );

      for (let i = 0; i < positions.length; i += 1) {
        const { position, type } = positions[i];
        const coord = getBoardCoordinate(position, cellSize, BOARD.PADDING);

        context.beginPath();
        context.arc(coord.x, coord.y, stoneSize, 0, Math.PI * 2);
        context.strokeStyle = COLOR.GEUMSU;
        context.fillStyle = COLOR.GEUMSU;
        context.lineWidth = LINE_WIDTH.GEUMSU;
        writeTextInCenter(context, coord, cellSize * 0.45, type);
        drawXInArc(context, coord, stoneSize);
        context.stroke();
        context.closePath();
      }
    };

    if (context && turn === 'black') {
      drawGeumsu(geumsu);
      setPrev(geumsu.map((g) => g.position));
    }
  }, [geumsu, context, turn]);

  useEffect(() => {
    if (!context) return;
    const { cellSize, stoneSize } = calculateSizes(
      context.canvas,
      BOARD.SIZE,
      BOARD.PADDING,
      RATIO,
    );

    // 금수 UI 지우기
    const removeGeumsu = (positions: Position[]) => {
      if (!context) return;

      positions.forEach((position) => {
        const coord = getBoardCoordinate(position, cellSize, BOARD.PADDING);
        context.clearRect(
          coord.x - (stoneSize + LINE_WIDTH.STONE + PIXEL_OFFSET),
          coord.y - (stoneSize + LINE_WIDTH.STONE + PIXEL_OFFSET),
          stoneSize * 2 + (LINE_WIDTH.STONE + PIXEL_OFFSET) * 2,
          stoneSize * 2 + (LINE_WIDTH.STONE + PIXEL_OFFSET) * 2,
        );
      });
    };

    // 백돌 턴일 때 이전 금수 UI 지우기
    if (turn === 'white') {
      context.save();
      removeGeumsu(prev);
      context.restore();
    }
  }, [turn, context, prev]);

  return null;
}

export default GeumsuOverlay;
