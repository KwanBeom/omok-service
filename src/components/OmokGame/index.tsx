import { useEffect, useRef, useState } from 'react';

import Omok from '@/app/_omok/Omok';
import type { Position, StoneBoard } from '@/app/_omok/types';

import styles from './OmokGame.module.css';
import BoardUI from './BoardUI';
import { getStoneColor } from '@/app/_omok/utils';

/** 컨트롤 패널 컴포넌트(사용자 정보, 착수 버튼 등) */
function ControlPanel({ onButtonClick }: { onButtonClick?: () => void }) {
  return (
    <button type="button" className={styles.dropBtn} onClick={onButtonClick}>
      착수
    </button>
  );
}

/** 오목 게임 컴포넌트 */
function OmokGame() {
  const { current: omok } = useRef(new Omok());
  const [prevDroppedPosition, setPrevDroppedPosition] = useState<Position>();
  const [position, setPosition] = useState<Position | never>();
  const [board, setBoard] = useState(omok.getBoard());
  const [count, setCount] = useState(0);
  const currentPlayer = getStoneColor(count);

  function playOmok(pos: Position) {
    omok.play(pos);
    setPrevDroppedPosition(pos);
    setCount(omok.getCount());
  }

  useEffect(() => {
    const isGameOver = omok.checkWin();

    if (isGameOver) {
      alert(`${currentPlayer} 승리!`);
    }
    console.log(omok.getCount(), omok.checkWin());
  }, [omok, board]);

  return (
    <>
      <BoardUI
        onSelect={(pos) => setPosition(pos)}
        position={prevDroppedPosition}
        geumsuPosition={omok.getGeumsu()}
        color={currentPlayer}
      />
      <ControlPanel
        onButtonClick={() => {
          if (position) playOmok(position);
          setPosition(undefined);
          setBoard([...omok.getBoard()]);
        }}
      />
    </>
  );
}

export default OmokGame;
