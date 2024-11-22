import { useEffect, useState } from 'react';
import { Canvas, useCanvasContext } from './contexts/CanvasContext';
import styles from './styles/BoardUI.module.css';
import { CANVAS, CONFIG } from './constants';
import { Position } from '../../types/Position';
import Stones, { Stone } from './subcomponents/Stones';
import GeumsuOverlay, { Geumsu } from './subcomponents/GeumsuOverlay';
import BoardBackground from './subcomponents/Background';
import PositionHilight from './subcomponents/PositionHighlight';
import { calculateSizes } from './utils/BoardUI.utils';

const { BOARD, RATIO } = CONFIG;

/** 오목판 UI 컴포넌트 */
function BoardUI({
  turn,
  player,
  stones,
  geumsu,
  onClick,
}: {
  player: 'black' | 'white';
  turn: 'black' | 'white';
  stones: Stone[];
  geumsu: Geumsu[];
  onClick?: (position: Position) => void;
}) {
  const { context, canvasRef } = useCanvasContext();
  const canvas = canvasRef.current;
  const [selectedPosition, setSelectedPosition] = useState<Position | undefined>();

  useEffect(() => {
    const handleCanvasClick = (e: MouseEvent) => {
      if (!canvas) return;
      const { cellSize } = calculateSizes(canvas, BOARD.SIZE, BOARD.PADDING, RATIO);
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - BOARD.PADDING / 2;
      const y = e.clientY - rect.top - BOARD.PADDING / 2;
      const position = {
        x: Math.round((y / cellSize) * RATIO),
        y: Math.round((x / cellSize) * RATIO),
      };
      setSelectedPosition(position);
    };

    if (canvas) canvas.addEventListener('click', handleCanvasClick);

    return () => {
      if (canvas) canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [canvas, context]);

  useEffect(() => {
    if (onClick && selectedPosition) onClick(selectedPosition);
  }, [selectedPosition, onClick]);
  return (
    <>
      <Canvas
        className={styles.board}
        width={CANVAS.WIDTH}
        height={CANVAS.HEIGHT}
        style={{ width: CANVAS.WIDTH / RATIO, height: CANVAS.HEIGHT / RATIO }}
      />
      <BoardBackground />
      <Stones stones={stones} />
      {player === 'black' && <GeumsuOverlay geumsu={geumsu} turn={turn} />}
      <PositionHilight position={selectedPosition} />
    </>
  );
}

export default BoardUI;
