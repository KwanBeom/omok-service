import { useState, useEffect } from 'react';

/** board UI의 cell size를 상태로 반환 */
const useCellSize = (
  canvas: HTMLCanvasElement | null,
  boardSize: number,
  boardPadding?: number,
) => {
  const [cellSize, setCellSize] = useState(0);

  useEffect(() => {
    if (canvas) {
      // board에 padding이 존재하는 경우 캔버스의 너비에서 빼줌
      const newCellSize = (canvas.offsetWidth - (boardPadding || 0 * 2)) / boardSize;
      setCellSize(newCellSize);
    }
  }, [canvas, boardSize, boardPadding]);

  return cellSize;
};

export default useCellSize;
