import { useEffect, useState } from 'react';
import { Canvas, useCanvasContext } from '../../contexts/CanvasContext';
import { CONFIG } from './constants';
import { Position } from '../../types/Position';
import Stones from './subcomponents/Stones';
import GeumsuOverlay from './subcomponents/GeumsuOverlay';
import BoardBackground from './subcomponents/Background';
import PositionHighlight from './subcomponents/PositionHighlight';
import { calculateSizes, isValidPosition } from './utils/BoardUI.utils';
import { useOmokContext } from '../../contexts/OmokContext';
import styles from './BoardUI.module.css';

const { BOARD, RATIO } = CONFIG;

/** 오목판 UI 컴포넌트 */
function BoardUI({ onClick }: { onClick?: (position: Position) => void }) {
  const { user, sequence, geumsu } = useOmokContext();
  // 선택된 포지션 [0 - 14]
  const [selectedPosition, setSelectedPosition] = useState<Position | undefined>();
  const { context, canvasRef, canvasSize, boardPadding } = useCanvasContext();
  const canvas = canvasRef.current;
  // 오목판 1칸의 크기 상태
  const [cellSizeState, setCellSizeState] = useState(0);

  useEffect(() => {
    if (!canvas) return;
    const { cellSize } = calculateSizes(canvasSize / RATIO, BOARD.SIZE, boardPadding, RATIO);
    setCellSizeState(cellSize);
  }, [canvas, boardPadding, canvasSize]);

  useEffect(() => {
    // 캔버스 클릭시 선택 포지션 업데이트
    const handleCanvasClick = (e: MouseEvent) => {
      if (!canvas || cellSizeState === 0) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - boardPadding / 2;
      const y = e.clientY - rect.top - boardPadding / 2;
      const position = {
        x: Math.round((y / cellSizeState) * RATIO),
        y: Math.round((x / cellSizeState) * RATIO),
      };
      if (isValidPosition(position, BOARD.SIZE)) setSelectedPosition(position);
    };

    if (canvas) canvas.addEventListener('click', handleCanvasClick);

    return () => {
      if (canvas) canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [canvas, context, cellSizeState, boardPadding]);

  useEffect(() => {
    if (onClick && selectedPosition) onClick(selectedPosition);
  }, [selectedPosition, onClick]);

  return (
    <div className={styles.boardWrapper}>
      <Canvas
        className={styles.board}
        width={canvasSize}
        height={canvasSize}
        style={{ width: canvasSize / RATIO, height: canvasSize / RATIO }}
      />
      <BoardBackground />
      <Stones stones={sequence} />
      {user === 1 && <GeumsuOverlay geumsu={geumsu} />}
      <PositionHighlight position={selectedPosition} />
    </div>
  );
}

export default BoardUI;
