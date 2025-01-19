import { useState } from 'react';

type Sequence = { position: { x: number; y: number }; color: 1 | 2 };
/**
 * 오목돌이 놓아진 순서를 관리하는 커스텀 훅
 * @returns {Array<Array<number>>} board
 */
const useSequence = (): {
  sequence: Sequence[];
  update: (x: number, y: number, color: 1 | 2) => void;
} => {
  const [sequence, setSequence] = useState<Sequence[]>([]);
  const update = (x: number, y: number, color: 1 | 2) => {
    setSequence((prev) => [...prev, { position: { x, y }, color }]);
  };

  return { sequence, update };
};

export default useSequence;
