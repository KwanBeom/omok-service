'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Omok from '../_omok/core/Omok';
import { Position } from './types/Position';
import { PlayerColor } from './types/Stone';
import BoardUI from './components/BoardUI';
import ConfirmButton from './components/ConfirmButton';
import { CanvasProvider } from './components/BoardUI/contexts/CanvasContext';
import { Geumsu } from './components/BoardUI/subcomponents/GeumsuOverlay';
import { Stone } from './components/BoardUI/subcomponents/Stones';
import { RenjuGeumsu } from '../_omok/core/RenjuRule';
import { isPositionIncluded } from './components/BoardUI/helpers/positionHelper';

const GEUMSU_TYPES = {
  samsam: '33',
  sasa: '44',
  jangmok: '6+',
} as const;

export default function Page() {
  const omok = useRef(new Omok()).current;
  const [player, setPlayer] = useState<PlayerColor>('black');
  const [turn, setTurn] = useState<PlayerColor>('black');
  const [stones, setStones] = useState<Stone[]>([]);
  const [geumsu, setGeumsu] = useState<Geumsu[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<Position | undefined>();
  const [gameOver, setGameOver] = useState<boolean>(false);

  // 턴이 변경될 때마다 게임 종료 여부 업데이트
  useEffect(() => {
    setGameOver(omok.checkWin());
  }, [turn, omok]);

  // 턴을 변경하는 함수
  const toggleTurn = useCallback(() => {
    setTurn((prevTurn) => (prevTurn === 'black' ? 'white' : 'black'));
  }, []);

  // 금수 데이터를 UI 컴포넌트 데이터로 포맷팅 하는 함수
  const formatGeumsuData = (geumsuData: RenjuGeumsu): Geumsu[] =>
    Object.entries(geumsuData).flatMap(([type, positions]) =>
      positions.map((position) => ({
        position,
        type: GEUMSU_TYPES[type as keyof typeof GEUMSU_TYPES],
      })),
    );

  // 오목 돌을 두고 관련 상태를 업데이트하는 함수
  const placeStone = (position: Position) => {
    setStones((prevStones) => [...prevStones, { position, color: turn }]);
    omok.play(position.x, position.y);
    setGeumsu(formatGeumsuData(omok.getGeumsu()));
    toggleTurn();
  };

  // 한 수 되돌리기
  // const undoLastMove = () => {
  //   omok.undo();
  //   setStones((prevStones) => prevStones.slice(0, -1)); // 마지막 돌 제거
  //   setGeumsu(formatGeumsuData(omok.getGeumsu())); // 금수 정보 업데이트
  //   toggleTurn();
  // };

  // confirm button event handler
  const handleConfirm = () => {
    if (!selectedPosition) return;

    const isStonePlaced = isPositionIncluded(
      stones.map((data) => data.position),
      selectedPosition,
    );

    if (isStonePlaced) return;

    if (player === 'black' && turn === 'black') {
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
        player={player}
        turn={turn}
        stones={stones}
        geumsu={geumsu}
        onClick={setSelectedPosition}
      />
      <ConfirmButton onClick={handleConfirm} />
    </CanvasProvider>
  );
}
