import { useEffect, useState } from 'react';
import { Position } from '@/app/game/types/Position';
import { useCanvasContext } from '../contexts/CanvasContext';
import { CONFIG } from '../constants';
import { calculateSizes } from '../utils/BoardUI.utils';
import { getBoardCoordinate } from '../helpers/canvasHelper';

const { BOARD, RATIO, COLOR, LINE_WIDTH } = CONFIG;

function PositionHilight({ position }: { position?: Position }) {
  const { context } = useCanvasContext();
  const [prev, setPrev] = useState<Position>();

  const draw = (
    ctx: CanvasRenderingContext2D,
    p: Position,
    cellSize: number,
    fillColor: string = COLOR.HIGHLIGHT.FILL,
    strokeColor: string = COLOR.HIGHLIGHT.STROKE,
    lineWidth: number = LINE_WIDTH.HIGHLIGHT,
  ) => {
    const coord = getBoardCoordinate(p, cellSize, BOARD.PADDING);
    const triangleSize = cellSize * 0.3;
    const halfCell = cellSize / 2;
    const triangleCoordinates = [
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

    const drawTriangle = (x: number, y: number, vertices: Position[]) => {
      ctx.beginPath();
      ctx.moveTo(x + vertices[0].x, y + vertices[0].y);
      ctx.lineTo(x + vertices[1].x, y + vertices[1].y);
      ctx.lineTo(x + vertices[2].x, y + vertices[2].y);
      ctx.closePath();
      // 삼각형 내부 채우기
      ctx.fillStyle = fillColor;
      ctx.fill();
      // 외곽선
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = strokeColor;
      ctx.stroke();
    };

    triangleCoordinates.forEach((vertices) => {
      drawTriangle(coord.x, coord.y, vertices);
    });
  };

  useEffect(() => {
    if (!context) return;
    const { cellSize } = calculateSizes(context.canvas, BOARD.SIZE, BOARD.PADDING, RATIO);

    if (position) {
      draw(context, position, cellSize);
      setPrev(position);
    }

    if (prev) {
      if (prev.x === position?.x && prev.y === position?.y) return;
      draw(context, prev, cellSize, COLOR.BOARD, COLOR.BOARD, LINE_WIDTH.HIGHLIGHT * 3);
    }
  }, [position, prev, context]);

  return null;
}

export default PositionHilight;
