import { useState, useEffect } from 'react';
import { calculateCellSize } from '../utils/BoardUI.utils';

const useCellSize = (canvas: HTMLCanvasElement | null, boardSize: number, pixelOffset: number) => {
  const [cellSize, setCellSize] = useState(0);

  useEffect(() => {
    if (canvas) {
      const newCellSize = calculateCellSize(canvas.offsetWidth, boardSize) - pixelOffset;
      setCellSize(newCellSize);
    }
  }, [canvas, pixelOffset, boardSize]);

  return cellSize;
};

export default useCellSize;
