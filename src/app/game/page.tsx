'use client';

import { useRef, useState, useEffect } from 'react';
import useTurn from '@/hooks/useTurn';
import useSequence from '@/hooks/useSequence';
import Omok from '../_omok/core/Omok';
import { Position } from './types/Position';
import { PlayerColor } from './types/Stone';
import BoardUI from './components/BoardUI';
import ConfirmButton from './components/ConfirmButton';
import { CanvasProvider } from './components/BoardUI/contexts/CanvasContext';
import { Geumsu } from './components/BoardUI/subcomponents/GeumsuOverlay';
import { RenjuGeumsu } from '../_omok/core/RenjuRule';
import { isPositionIncluded } from './components/BoardUI/helpers/positionHelper';
import ControlPanel from './components/ControlPanel';

const GEUMSU_TYPES = {
  samsam: '33',
  sasa: '44',
  jangmok: '6+',
} as const;

// 금수 데이터를 UI 컴포넌트 데이터로 포맷팅 하는 함수
const formatGeumsuData = (geumsuData: RenjuGeumsu): Geumsu[] =>
  Object.entries(geumsuData).flatMap(([type, positions]) =>
    positions.map((position) => ({
      position,
      type: GEUMSU_TYPES[type as keyof typeof GEUMSU_TYPES],
    })),
  );

export default function Page() {
  const omok = useRef(new Omok()).current;
  // 현재 플레이어가 흑돌/백돌인지에 대한 상태
  const [currentUser, setCurrentUser] = useState<PlayerColor>('black');
  // turn 1 - 흑, 2 - 백
  const { turn, changeTurn } = useTurn();
  // 오목돌 놓아진 순서 관리
  const { sequence, update: updateSequence } = useSequence();
  const [geumsu, setGeumsu] = useState<Geumsu[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<Position | undefined>();
  const [winner, setWinner] = useState<PlayerColor | null>(null);

  // 오목 돌 두고 관련 상태를 업데이트하는 함수
  const placeStone = (position: Position) => {
    omok.play(position.x, position.y);
    updateSequence(position.x, position.y, turn);
    setGeumsu(formatGeumsuData(omok.getGeumsu()));
    changeTurn();
    if (omok.checkWin()) {
      setWinner(turn === 1 ? 'black' : 'white');
    }
  };

  useEffect(() => {
    if (winner) {
      alert(`${winner} win!`);
    }
  }, [winner]);

  // 한 수 되돌리기
  // const undoLastMove = () => {
  //   omok.undo();
  //   setStones((prevStones) => prevStones.slice(0, -1)); // 마지막 돌 제거
  //   setGeumsu(formatGeumsuData(omok.getGeumsu())); // 금수 정보 업데이트
  //   toggleTurn();
  // };

  // confirm button event handler
  const handleConfirm = () => {
    // 선택된 포지션이 없는 경우
    if (!selectedPosition) return;
    const isStonePlaced = isPositionIncluded(
      sequence.map((data) => data.position),
      selectedPosition,
    );
    // 이미 돌이 놓아진 경우 동작 무시
    if (isStonePlaced) return;
    // 현재 플레이어가 흑돌이고 흑돌 차례인 경우 금수 위치라면 동작 무시
    if (currentUser === 'black' && turn === 1) {
      const isGeumsuPosition = isPositionIncluded(
        geumsu.map((data) => data.position),
        selectedPosition,
      );
      if (isGeumsuPosition) return;
    }
    placeStone(selectedPosition);
    setSelectedPosition(undefined);
  };

  return (
    <CanvasProvider>
      <BoardUI
        player={currentUser}
        turn={turn === 1 ? 'black' : 'white'}
        stones={sequence}
        geumsu={geumsu}
        onClick={setSelectedPosition}
      />
      <ConfirmButton onClick={handleConfirm} />
      <ControlPanel />
    </CanvasProvider>
  );
}
