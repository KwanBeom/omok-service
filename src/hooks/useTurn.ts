import { BLACK, WHITE } from '@/app/game/types/Stone';
import { useState } from 'react';

type Turn = BLACK | WHITE;
/**
 * 턴에 관련된 상태를 관리하는 커스텀 훅
 * [1]: 흑돌, [2]: 백돌
 */
const useTurn = (initialTurn?: Turn) => {
  const [turn, setTurn] = useState<Turn>(initialTurn || 1);

  const changeTurn = () => {
    setTurn((prevTurn) => (prevTurn === 1 ? 2 : 1));
  };

  return { turn, changeTurn };
};

export default useTurn;
