'use client';

import socket from '@/src/socket';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSequence from '@/src/hooks/useSequence';
import {
  AssignStoneColorEvent,
  RoomInfoEvent,
  EVENT_KEYS,
  ServerPlayEvent,
  ClientPlayEvent,
  ErrorEvent,
} from '@/server/constants/events';
import { RenjuGeumsu } from '@/server/omok/core/RenjuRule';
import { Position } from './types/Position';
import { STONE } from './types/Stone';
import BoardUI from './components/BoardUI';
import ConfirmButton from './components/ConfirmButton';
import { CanvasProvider } from './contexts/CanvasContext';
import { isPositionIncluded } from './components/BoardUI/helpers/positionHelper';
import { OmokProvider } from './contexts/OmokContext';
import { CANVAS, CONFIG } from './components/BoardUI/constants';
import { Geumsu } from './types/Geumsu';
import styles from './page.module.css';
import { BLACK } from './constants/Player';
import { createRoom, joinRoom, leaveRoom } from './sockets/roomSocket';
import { ROOM_MODE } from '../lib/constants/room';

type RoomInfo = { id: string; count: number };

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

/** 방 생성/입장 처리 */
const connectToRoom = async (create: boolean, roomId: string) => {
  socket.connect();

  if (create) {
    const { success, message } = await createRoom(roomId);
    if (!success) {
      throw new Error(message);
    }
  }

  const { success, message } = await joinRoom(roomId);
  if (!success) {
    throw new Error(message);
  }

  return true;
};

export default function Page() {
  const [myColor, setMyColor] = useState<STONE>(1); // 현재 플레이어가 흑돌/백돌인지에 대한 상태
  const [turn, setTurn] = useState<STONE>(1); // 현재 착수해야 하는 플레이어가 누구인지, 1 - 흑, 2 - 백
  const { sequence, update: updateSequence, reset: resetSequence } = useSequence(); // 오목돌 놓아진 순서 관리
  const [geumsu, setGeumsu] = useState<Geumsu[]>([]); // 금수 데이터 상태
  const [selectedPosition, setSelectedPosition] = useState<Position | undefined>(); // 선택된 포지션 상태
  // canvas의 size를 지정, 여기서 canvas 사이즈는 배율을 곱한 값으로 css는 배율을 나눈 값으로 지정한다
  const [initialCanvasSize, setInitialCanvasSize] = useState(0);
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({ id: '', count: 0 }); // 방 정보
  const [isPlaying, setIsPlaying] = useState(false); // 게임 진행중 여부
  const isMyTurn = myColor === turn; // 현재 유저 턴인지
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const mode = searchParams.get('mode');
  const router = useRouter();

  /* 초기 설정 셋팅 */
  const init = useCallback(() => {
    // 기본 캔버스 사이즈 초기화
    const scaledWidth = window.innerWidth * CONFIG.RATIO;
    setInitialCanvasSize(scaledWidth < CANVAS.WIDTH ? scaledWidth : CANVAS.WIDTH);
  }, []);

  // 초기 설정 함수 실행
  useEffect(init, [init]);

  // 방 입장 및 퇴장처리
  useEffect(() => {
    connectToRoom(Number(mode) === ROOM_MODE.CREATE, id!).catch((e) => {
      if (e instanceof Error) {
        alert(e.message);
        router.back();
      }
    });

    return () => leaveRoom(id!);
  }, [id, mode, router]);

  // 오목 돌 두고 관련 상태 업데이트
  const placeStone = (position: Position) => {
    const playData: ClientPlayEvent['clientSend'] = { position, userColor: myColor };
    // 클라이언트가 둔 데이터를 서버에 보냄
    socket.emit(EVENT_KEYS.CLIENT_PLAY, playData);
  };

  // 게임 리셋
  const resetGame = useCallback(() => {
    setSelectedPosition(undefined);
    setGeumsu([]);
    resetSequence();
    setTurn(BLACK);
    socket.emit(EVENT_KEYS.GAME_RESET);
  }, [resetSequence]);

  useEffect(() => {
    // 방 정보 상태 업데이트
    socket.on(EVENT_KEYS.ROOM_INFO, (data: RoomInfoEvent['serverSend']) => {
      setRoomInfo({ id: data.roomId, count: data.userCount });
    });

    // 게임 시작시 돌 색깔 할당 이벤트 감지하고 상태 업데이트
    socket.on(EVENT_KEYS.ASSIGN_STONE_COLOR, ({ color }: AssignStoneColorEvent['serverSend']) => {
      setIsPlaying(true);
      setMyColor(color);
    });

    // 오목 진행 이후 업데이트 된 관련 상태 전달받음
    socket.on(EVENT_KEYS.SERVER_PLAY, (data: ServerPlayEvent['serverSend']) => {
      setGeumsu(formatGeumsuData(data.geumsu)); // 금수 설정
      updateSequence(data.position.x, data.position.y, data.stoneColor); // 돌 놓은 순서 업데이트
      setTurn(data.turn);
    });

    // game over event
    socket.on(EVENT_KEYS.GAME_OVER, () => {
      alert(`${turn === 1 ? 'black' : 'white'} is Win, 게임을 초기화합니다.`);
      setIsPlaying(false);
      resetGame();
    });

    socket.on(EVENT_KEYS.ERROR, ({ message }: ErrorEvent['serverSend']) => {
      alert(message || '에러가 발생했습니다.');
    });

    return () => {
      socket.off(EVENT_KEYS.ASSIGN_STONE_COLOR);
      socket.off(EVENT_KEYS.ROOM_INFO);
      socket.off(EVENT_KEYS.SERVER_PLAY);
      socket.off(EVENT_KEYS.GAME_OVER);
      socket.off(EVENT_KEYS.GAME_RESET);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isPlaying) resetGame();
  }, [isPlaying, resetGame]);

  // 한 수 되돌리기
  // const undoLastMove = () => {
  //   omok.undo();
  //   setStones((prevStones) => prevStones.slice(0, -1)); // 마지막 돌 제거
  //   setGeumsu(formatGeumsuData(omok.getGeumsu())); // 금수 정보 업데이트
  //   toggleTurn();
  // };

  // 착수 버튼 이벤트 함수
  const handleConfirm = () => {
    // 선택된 포지션이 없는 경우 동작 무시
    if (!selectedPosition) return;
    const isStonePlaced = isPositionIncluded(
      sequence.map((data) => data.position),
      selectedPosition,
    );
    // 이미 돌이 놓아진 경우 동작 무시
    if (isStonePlaced) return;
    // 플레이어 === 흑돌, turn === 흑돌, 선택한 위치가 금수 위치이면 동작 무시
    if (myColor === BLACK && turn === BLACK) {
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
    <>
      <header className={styles.header}>
        입장한 인원: {roomInfo.count}, 방 이름: {roomInfo.id}
      </header>
      <OmokProvider user={myColor} sequence={sequence} geumsu={geumsu} turn={turn}>
        <CanvasProvider canvasSize={initialCanvasSize}>
          <BoardUI onClick={setSelectedPosition} />
          {isPlaying && <ConfirmButton onClick={handleConfirm} disabled={!isMyTurn} />}
        </CanvasProvider>
        {/* <button type="button" onClick={() => socket.emit(EVENT_KEYS.GAME_RESET, { roomId: id })}>
          reset
        </button> */}
      </OmokProvider>
    </>
  );
}
