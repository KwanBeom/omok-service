'use client';

import { useRef, useState, useEffect } from 'react';
import useTurn from '@/hooks/useTurn';
import useSequence from '@/hooks/useSequence';
import Omok from '../_omok/core/Omok';
import { Position } from './types/Position';
import { PlayerColor, STONE } from './types/Stone';
import BoardUI from './components/BoardUI';
import ConfirmButton from './components/ConfirmButton';
import { CanvasProvider } from './contexts/CanvasContext';
import { RenjuGeumsu } from '../_omok/core/RenjuRule';
import { isPositionIncluded } from './components/BoardUI/helpers/positionHelper';
import ControlPanel from './components/ControlPanel';
import { OmokProvider } from './contexts/OmokContext';
import { CANVAS, CONFIG } from './components/BoardUI/constants';
import { Geumsu } from './types/Geumsu';

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
  const [currentUser, setCurrentUser] = useState<STONE>(1);
  // turn 1 - 흑, 2 - 백
  const { turn, changeTurn } = useTurn();
  // 오목돌 놓아진 순서 관리
  const { sequence, update: updateSequence } = useSequence();
  const [geumsu, setGeumsu] = useState<Geumsu[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<Position | undefined>();
  const [winner, setWinner] = useState<PlayerColor | null>(null);
  // canvas의 size를 지정, 여기서 canvas 사이즈는 배율을 곱한 값으로 css는 배율을 나눈 값으로 지정한다
  const [initialCanvasSize, setInitialCanvasSize] = useState(0);

  // 오목 돌 두고 관련 상태를 업데이트하는 함수
  const placeStone = (position: Position) => {
    omok.play(position.x, position.y); // omok core에 진행 메서드 호출
    updateSequence(position.x, position.y, turn); // 돌 놓은 순서 업데이트
    setGeumsu(formatGeumsuData(omok.getGeumsu())); // 금수 정보 업데이트
    changeTurn(); // 턴 변경
    // 승리 조건 체크
    if (omok.checkWin()) {
      setWinner(turn === 1 ? 'black' : 'white');
    }
  };

  useEffect(() => {
    // TODO: 승리 시 로직 구현
    if (winner) alert(`${winner} win!`);
  }, [winner]);

  useEffect(() => {
    const scaledWidth = window.innerWidth * CONFIG.RATIO;
    // 기본 캔버스 사이즈 지정, 초기 값 설정 이후 고정
    setInitialCanvasSize(scaledWidth < CANVAS.WIDTH ? scaledWidth : CANVAS.WIDTH);
  }, []);

  // 한 수 되돌리기
  // const undoLastMove = () => {
  //   omok.undo();
  //   setStones((prevStones) => prevStones.slice(0, -1)); // 마지막 돌 제거
  //   setGeumsu(formatGeumsuData(omok.getGeumsu())); // 금수 정보 업데이트
  //   toggleTurn();
  // };

  // confirm button event handler
  const handleConfirm = () => {
    // 선택된 포지션이 없는 경우 동작 무시
    if (!selectedPosition) return;
    const isStonePlaced = isPositionIncluded(
      sequence.map((data) => data.position),
      selectedPosition,
    );
    // 이미 돌이 놓아진 경우 동작 무시
    if (isStonePlaced) return;

    // 플레이어 === 흑돌, turn === 흑돌, position === 금수면 동작 무시
    if (currentUser === 1 && turn === 1) {
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
    <OmokProvider user={currentUser} sequence={sequence} geumsu={geumsu} turn={turn}>
      <CanvasProvider canvasSize={initialCanvasSize}>
        <BoardUI onClick={setSelectedPosition} />
        <ConfirmButton onClick={handleConfirm} />
        <ControlPanel />
      </CanvasProvider>
    </OmokProvider>
  );
}
