import { useState } from 'react';
import { BLACK, WHITE } from '../app/game/constants/Player';

type Turn = typeof BLACK | typeof WHITE;
/**
 * 턴에 관련된 상태를 관리하는 커스텀 훅
 * [1]: 흑돌, [2]: 백돌
 */
const useTurn = (initialTurn?: Turn) => {
  const [turn, setTurn] = useState<Turn>(initialTurn || BLACK);

  const changeTurn = () => {
    setTurn((prevTurn) => (prevTurn === BLACK ? WHITE : BLACK));
  };

  return { turn, setTurn, changeTurn };
};

export default useTurn;
