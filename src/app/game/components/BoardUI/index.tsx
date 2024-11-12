import { useEffect, useState } from 'react';
import { Canvas, useCanvasContext } from './context/CanvasContext';
import styles from './styles/BoardUI.module.css';
import useCellSize from './hooks/useCellSize';
import { BOARD_SIZE, PIXEL_OFFSET } from './constants';
import { Position } from '../../types/Position';
import Stones, { Stone } from './subcomponents/Stones';
import GeumsuOverlay, { Geumsu } from './subcomponents/GeumsuOverlay';
import BoardBackground from './subcomponents/Background';

// TODO: 외곽에 여백 만들고, 클릭한 위치 좌표 계산하는 공식

/** 오목판 UI 컴포넌트 */
function BoardUI({
  stones,
  geumsu,
  onClick,
}: {
  stones: Stone[];
  geumsu: Geumsu[];
  onClick?: (position: Position) => void;
}) {
  const { canvasRef } = useCanvasContext();
  const cellSize = useCellSize(canvasRef.current, BOARD_SIZE, PIXEL_OFFSET);
  const [selectedPosition, setSelectedPosition] = useState<Position | undefined>();
  const canvas = canvasRef.current;

  useEffect(() => {
    const updateSelectedPosition = (e: MouseEvent) => {
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setSelectedPosition({
        x: Math.round((y / cellSize) * 2),
        y: Math.round((x / cellSize) * 2),
      });
    };

    if (canvas) {
      canvas.addEventListener('click', updateSelectedPosition);
    }

    return () => {
      if (canvas) canvas.removeEventListener('click', updateSelectedPosition);
    };
  }, [canvas, cellSize]);

  useEffect(() => {
    if (onClick && selectedPosition) onClick(selectedPosition);
  }, [selectedPosition, onClick]);

  return (
    <>
      <Canvas className={styles.board} width={1000} height={1000} />
      <BoardBackground />
      <Stones stones={stones} />
      <GeumsuOverlay geumsu={geumsu} />
    </>
  );
}

export default BoardUI;
