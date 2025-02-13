import { useCallback, useState } from 'react';

export type Sequence = { position: { x: number; y: number }; color: 1 | 2 };
/**
 * 오목돌이 놓아진 순서를 관리하는 커스텀 훅
 * @returns {Array<Array<number>>} board
 */
const useSequence = (): {
  sequence: Sequence[];
  update: (x: number, y: number, color: 1 | 2) => void;
  reset: () => void;
} => {
  const [sequence, setSequence] = useState<Sequence[]>([]);
  const update = useCallback((x: number, y: number, color: 1 | 2) => {
    setSequence((prev) => [...prev, { position: { x, y }, color }]);
  }, []);
  const reset = useCallback(() => {
    setSequence([]);
  }, []);

  return { sequence, update, reset };
};

export default useSequence;
