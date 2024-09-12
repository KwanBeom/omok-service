import { BOARD_SIZE, EMPTY } from '@/app/_omok/Board';
import { POINT_BLACK, StoneColor } from '@/app/_omok/Stone';
import { Position } from '@/app/_omok/types';
import useCanvas from '@/hooks/useCanvas';
import useMousePosition from '@/hooks/useMousePosition';
import { useEffect, useState } from 'react';
import styles from './OmokGame.module.css';
import Omok from '@/app/_omok/Omok';

type BoardUIProps = {
  color: StoneColor;
  geumsuPosition: ReturnType<Omok['getGeumsu']>;
  position?: Position;
  onSelect?: (pos: Position) => void;
};

const PIXEL_OFFSET = 0.5;

// TODO: 외곽에 여백 만들고.. 클릭한 위치 좌표 계산하는 공식..

/** 오목판 UI 컴포넌트 */
function BoardUI({ position, geumsuPosition, color, onSelect }: BoardUIProps) {
  const { jangmok, samsam, sasa } = geumsuPosition;
  const [selectPos, setSelectPos] = useState<Position | null>(null);
  const { canvas, ref, context } = useCanvas('2d');
  const [cellSize, setCellSize] = useState(0);
  const { x, y } = useMousePosition(ref, { throttleDelay: 100 });

  useEffect(() => {
    if (onSelect && selectPos) onSelect(selectPos);
  }, [onSelect, selectPos]);

  useEffect(() => {
    /** 오목돌 그리기 */
    function drawStone() {
      if (context && position) {
        context.beginPath();
        context.fillStyle = color;
        context.arc(
          cellSize * position[1],
          cellSize * position[0],
          cellSize * 0.45,
          0,
          Math.PI * 2,
        );
        context.fill();
      }
    }

    drawStone();
  }, [position, color, context, cellSize]);

  useEffect(() => {
    /** 오목판 그리기 */
    function drawBoard() {
      if (context && cellSize) {
        // 점 위치 포지션
        const dotsPos = [
          [3, 3],
          [3, 11],
          [7, 7],
          [11, 3],
          [11, 11],
        ];

        // 줄 그리기
        for (let i = 0; i < BOARD_SIZE; i += 1) {
          for (let j = 0; j < BOARD_SIZE; j += 1) {
            context.strokeRect(cellSize * i, cellSize * j, cellSize, cellSize);

            // 점 찍기
            if (dotsPos.find((pos) => pos[0] === i && pos[1] === j)) {
              context.beginPath();
              context.fillStyle = 'black';
              context.arc(
                cellSize * i,
                cellSize * j,
                cellSize / BOARD_SIZE,
                0,
                Math.PI * 2,
              );
              context.fill();
            }
          }
        }
      }
    }

    drawBoard();
  }, [canvas, context, cellSize]);

  // 셀 사이즈 업데이트
  useEffect(() => {
    if (canvas) {
      // 정사각형이기 때문에 width만 사용
      const { offsetWidth } = canvas;

      setCellSize(Math.floor((offsetWidth / BOARD_SIZE) * 2));
    }
  }, [canvas]);

  // 클릭 이벤트 발생시 선택된 셀 포지션 업데이트
  useEffect(() => {
    const target = ref.current;

    function updateSelectPos() {
      const currPos: Position = [
        Math.round((y / cellSize) * 2),
        Math.round((x / cellSize) * 2),
      ];

      setSelectPos(currPos);
    }

    if (target) {
      target.addEventListener('click', updateSelectPos);
    }

    return () => {
      if (target) {
        target.removeEventListener('click', updateSelectPos);
      }
    };
  }, [ref, x, y, cellSize]);

  return (
    <canvas
      className={styles.board}
      ref={ref}
      // 오목판 여백 위해 cellSize만큼 크기 늘림
      width={1000}
      height={1000}
    />
  );
}

export default BoardUI;
