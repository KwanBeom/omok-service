import { useEffect, useState } from 'react';
import { Position } from '@/src/app/game/types/Position';
import { isSamePosition } from '@/server/omok/entities/Position';
import { useCanvasContext } from '../../../contexts/CanvasContext';
import { CONFIG } from '../constants';
import { calculateSizes, isValidPosition } from '../utils/BoardUI.utils';
import { getBoardCoordinate } from '../helpers/canvasHelper';

const { BOARD, RATIO, COLOR, LINE_WIDTH } = CONFIG;

function PositionHighlight({ position }: { position?: Position }) {
  const { context, boardPadding } = useCanvasContext();
  const [prev, setPrev] = useState<Position>();

  /* 포지션 하이라이트 작은 삼각형 좌표 */
  const getTriangleCoordinates = (cellSize: number) => {
    const halfCell = cellSize / 2;
    const triangleSize = cellSize * 0.3;
    return [
      // 좌상
      [
        { x: -halfCell, y: -halfCell },
        { x: -halfCell, y: -halfCell + triangleSize },
        { x: -halfCell + triangleSize, y: -halfCell },
      ],
      // 우하
      [
        { x: halfCell, y: halfCell },
        { x: halfCell, y: halfCell - triangleSize },
        { x: halfCell - triangleSize, y: halfCell },
      ],
      // 좌하
      [
        { x: -halfCell, y: halfCell },
        { x: -halfCell + triangleSize, y: halfCell },
        { x: -halfCell, y: halfCell - triangleSize },
      ],
      // 우상
      [
        { x: halfCell, y: -halfCell },
        { x: halfCell, y: -halfCell + triangleSize },
        { x: halfCell - triangleSize, y: -halfCell },
      ],
    ];
  };

  useEffect(() => {
    if (!context) return;

    // 하이라이트 그리는 함수
    const drawHighlight = (ctx: CanvasRenderingContext2D, p: Position, cellSize: number) => {
      const { x, y } = getBoardCoordinate(p, cellSize, boardPadding);
      const triangleCoordinates = getTriangleCoordinates(cellSize);

      triangleCoordinates.forEach((vertices) => {
        ctx.beginPath();
        ctx.moveTo(x + vertices[0].x, y + vertices[0].y);
        ctx.lineTo(x + vertices[1].x, y + vertices[1].y);
        ctx.lineTo(x + vertices[2].x, y + vertices[2].y);
        ctx.closePath();
        ctx.fillStyle = COLOR.HIGHLIGHT.FILL;
        ctx.fill();
        ctx.lineWidth = LINE_WIDTH.HIGHLIGHT;
        ctx.strokeStyle = COLOR.HIGHLIGHT.STROKE;
        ctx.stroke();
      });
    };

    const { cellSize } = calculateSizes(
      context.canvas.offsetWidth,
      BOARD.SIZE,
      boardPadding,
      RATIO,
    );

    // 하이라이트 그리기 + 이전 좌표 저장
    if (position && isValidPosition(position, BOARD.SIZE)) {
      // 이전 하이라이트가 있으면 캔버스 전체 지우기
      if (prev && !isSamePosition(prev, position)) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      }

      // 새 하이라이트를 그린다
      drawHighlight(context, position, cellSize);
      setPrev(position);
    }
  }, [position, context, boardPadding]);

  return null;
}

export default PositionHighlight;
