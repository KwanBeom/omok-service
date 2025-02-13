import { useEffect, useState } from 'react';
import Position from '@/server/omok/entities/Position';
import { BLACK, WHITE } from '@/src/app/game/constants/Player';
import { Geumsu } from '@/src/app/game/types/Geumsu';
import { useOmokContext } from '@/src/app/game/contexts/OmokContext';
import { useCanvasContext } from '../../../contexts/CanvasContext';
import { CONFIG, PIXEL_OFFSET } from '../constants';
import { calculateSizes } from '../utils/BoardUI.utils';
import { drawXInArc, getBoardCoordinate, writeTextInCenter } from '../helpers/canvasHelper';

const { COLOR, LINE_WIDTH, BOARD, RATIO } = CONFIG;

/** 오목판 위 금수 UI를 그리는 컴포넌트 */
function GeumsuOverlay({ geumsu }: { geumsu: Geumsu[] }) {
  const [prev, setPrev] = useState<Position[]>([]);
  const { context, boardPadding } = useCanvasContext();
  const { turn } = useOmokContext();

  // 금수 UI 그리기
  useEffect(() => {
    const drawGeumsu = (positions: Geumsu[]) => {
      if (!context && !context) return;
      const { cellSize, stoneSize } = calculateSizes(
        context.canvas.offsetWidth,
        BOARD.SIZE,
        boardPadding,
        RATIO,
      );

      for (let i = 0; i < positions.length; i += 1) {
        const { position, type } = positions[i];
        const coord = getBoardCoordinate(position, cellSize, boardPadding);
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

    if (context && turn === BLACK) {
      drawGeumsu(geumsu);
      setPrev(geumsu.map((g) => g.position));
    }
  }, [geumsu, context, turn, boardPadding]);

  useEffect(() => {
    if (!context && !context) return;
    const { cellSize, stoneSize } = calculateSizes(
      context.canvas.offsetWidth,
      BOARD.SIZE,
      boardPadding,
      RATIO,
    );

    // 금수 UI 지우기
    const removeGeumsu = (positions: Position[]) => {
      if (!context) return;

      positions.forEach((position) => {
        const coord = getBoardCoordinate(position, cellSize, boardPadding);
        context.clearRect(
          coord.x - (stoneSize + LINE_WIDTH.STONE + PIXEL_OFFSET),
          coord.y - (stoneSize + LINE_WIDTH.STONE + PIXEL_OFFSET),
          stoneSize * 2 + (LINE_WIDTH.STONE + PIXEL_OFFSET) * 2,
          stoneSize * 2 + (LINE_WIDTH.STONE + PIXEL_OFFSET) * 2,
        );
      });
    };

    // 백돌 턴일 때 이전 금수 UI 지우기
    if (turn === WHITE) {
      context.save();
      removeGeumsu(prev);
      context.restore();
    }
  }, [turn, context, prev, boardPadding]);

  return null;
}

export default GeumsuOverlay;
