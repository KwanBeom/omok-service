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
    if (!context && !context) return;

    // 하이라이트 그리는 함수
    const drawHighlight = (ctx: CanvasRenderingContext2D, p: Position, cellSize: number) => {
      const { x, y } = getBoardCoordinate(p, cellSize, boardPadding);
      // 작은 삼각형들 좌표
      const triangleCoordinates = getTriangleCoordinates(cellSize);

      triangleCoordinates.forEach((vertices) => {
        ctx.beginPath();
        ctx.moveTo(x + vertices[0].x, y + vertices[0].y);
        ctx.lineTo(x + vertices[1].x, y + vertices[1].y);
        ctx.lineTo(x + vertices[2].x, y + vertices[2].y);
        ctx.closePath();
        // 삼각형 내부 채우기
        ctx.fillStyle = COLOR.HIGHLIGHT.FILL;
        ctx.fill();
        // 외곽선 스타일 지정 및 그리기
        ctx.lineWidth = LINE_WIDTH.HIGHLIGHT;
        ctx.strokeStyle = COLOR.HIGHLIGHT.STROKE;
        ctx.stroke();
      });
    };

    const removeHighlight = (ctx: CanvasRenderingContext2D, p: Position, cellSize: number) => {
      const { x, y } = getBoardCoordinate(p, cellSize, boardPadding);
      // 작은 삼각형들 좌표
      const triangleCoordinates = getTriangleCoordinates(cellSize);

      triangleCoordinates.forEach((vertices) => {
        ctx.beginPath();
        ctx.moveTo(x + vertices[0].x, y + vertices[0].y);
        ctx.lineTo(x + vertices[1].x, y + vertices[1].y);
        ctx.lineTo(x + vertices[2].x, y + vertices[2].y);

        ctx.closePath();
        // 채우기
        ctx.fillStyle = COLOR.BOARD;
        ctx.fill();
        // 외곽선 스타일 지정 및 그리기
        ctx.lineWidth = LINE_WIDTH.BOARD;
        ctx.strokeStyle = COLOR.BOARD;
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
      drawHighlight(context, position, cellSize);
      setPrev(position);
    }

    if (prev && position && !isSamePosition(prev, position)) {
      removeHighlight(context, prev, cellSize);
    }
  }, [position, context, boardPadding]);

  return null;
}

export default PositionHighlight;
