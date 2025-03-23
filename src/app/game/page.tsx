'use client';

import socket from '@/src/socket';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSequence from '@/src/hooks/useSequence';
import {
  RoomInfoEvent,
  EVENT_KEYS,
  ServerPlayEvent,
  ClientPlayEvent,
  ErrorEvent,
  GameStartEvent,
  GameOverEvent,
} from '@/server/constants/events';
import useTimer from '@/src/hooks/useTimer';
import useTurn from '@/src/hooks/useTurn';
import useEffectOnce from '@/src/hooks/useEffectOnce';
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
import { BLACK } from './constants/Player';
import { createRoom, joinRoom, leaveRoom } from './sockets/roomSocket';
import { ROOM_MODE } from '../lib/constants/room';
import GameInfoHeader from './components/GameInfoHeader';
import ProgressBar from './components/TimeProgressBar';
import { TURN_TIME } from './constants/Time';
import ShadowBox from '../components/ShadowBox';

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
  // 방 생성인 경우
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

// TODO: 접속 끊김 처리에 대해서 어떻게 처리할지에 대해서 고민해보아야 할 듯 하다.

export default function Page() {
  const [ready, setReady] = useState(false);
  const [myColor, setMyColor] = useState<STONE>(1); // 현재 플레이어가 흑돌/백돌인지에 대한 상태
  const { turn, setTurn, changeTurn } = useTurn(); // 현재 턴 상태
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
  const { time, toggle: toggleTimer, reset: resetTimer } = useTimer(TURN_TIME);

  // 게임 리셋
  const resetGame = useCallback(() => {
    setSelectedPosition(undefined);
    setGeumsu([]);
    resetSequence();
    setTurn(BLACK);
    socket.emit(EVENT_KEYS.GAME_RESET);
    resetTimer();
    setReady(false);
    setIsPlaying(false);
  }, []);

  // 오목 돌 두고 관련 상태 업데이트
  const placeStone = (position: Position) => {
    const playData: ClientPlayEvent['clientSend'] = { position, userColor: myColor };
    // 클라이언트가 둔 데이터를 서버에 보냄
    socket.emit(EVENT_KEYS.CLIENT_PLAY, playData);
  };

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

  // 서버 이벤트 등록
  useEffect(() => {
    // 방 정보 상태 업데이트
    socket.on(EVENT_KEYS.ROOM_INFO, (data: RoomInfoEvent['serverSend']) => {
      setRoomInfo({ id: data.roomId, count: data.userCount });
    });

    // 게임 시작시 상태 업데이트
    socket.on(EVENT_KEYS.GAME_START, ({ color }: GameStartEvent['serverSend']) => {
      setIsPlaying(true);
      setMyColor(color);
    });

    // 오목 진행 이후 업데이트 된 관련 상태 전달받음
    socket.on(EVENT_KEYS.SERVER_PLAY, (data: ServerPlayEvent['serverSend']) => {
      setGeumsu(formatGeumsuData(data.geumsu)); // 금수 설정
      updateSequence(data.position.x, data.position.y, data.stoneColor); // 돌 놓은 순서 업데이트
      changeTurn();
      resetTimer();
    });

    // game over event
    socket.on(EVENT_KEYS.GAME_OVER, ({ winner }: GameOverEvent['serverSend']) => {
      alert(`${winner === BLACK ? '흑' : '백'} 승리, 게임을 초기화합니다.`);
      setIsPlaying(false);
      resetGame();
    });

    socket.on(EVENT_KEYS.ERROR, ({ message }: ErrorEvent['serverSend']) => {
      alert(message || '에러가 발생했습니다.');
    });

    // 기본 캔버스 사이즈 초기화
    const scaledWidth = window.innerWidth * CONFIG.RATIO;
    setInitialCanvasSize(scaledWidth < CANVAS.WIDTH ? scaledWidth : CANVAS.WIDTH);

    return () => {
      socket.off(EVENT_KEYS.ASSIGN_STONE_COLOR);
      socket.off(EVENT_KEYS.ROOM_INFO);
      socket.off(EVENT_KEYS.SERVER_PLAY);
      socket.off(EVENT_KEYS.GAME_OVER);
      socket.off(EVENT_KEYS.GAME_RESET);
      socket.disconnect();
    };
  }, []);

  // 방 입장 및 퇴장처리
  useEffectOnce(() => {
    connectToRoom(Number(mode) === ROOM_MODE.CREATE, id!).catch((e) => {
      if (e instanceof Error) {
        alert(e.message);
      }
      router.back();
    });

    return () => leaveRoom(id!);
  }, [id, mode, router]);

  // 게임 시작시 타이머 동작
  useEffect(() => {
    if (isPlaying) {
      toggleTimer();
    } else {
      resetTimer();
    }
  }, [isPlaying]);

  // 턴이 바뀌면 타이머 리셋
  useEffect(() => {
    console.log('턴 바꼈따아');
    if (isPlaying) {
      resetTimer();
      toggleTimer();
    }
  }, [isPlaying, turn]);

  useEffect(() => {
    if (isPlaying && roomInfo.count < 2) {
      alert('상대방이 나가서 게임이 종료됩니다.');
      resetGame();
      toggleTimer();
    }
  }, [roomInfo.count, isPlaying]);

  useEffect(() => {
    socket.emit(EVENT_KEYS.GAME_READY, { ready });
  }, [ready]);
  console.log(time);
  return (
    <>
      <GameInfoHeader roomId={roomInfo.id} userCount={roomInfo.count} />
      <OmokProvider user={myColor} sequence={sequence} geumsu={geumsu} turn={turn}>
        <CanvasProvider canvasSize={initialCanvasSize}>
          <BoardUI onClick={setSelectedPosition} />
          <ShadowBox>
            {isPlaying && <ProgressBar time={time} turn={turn} />}
            {isPlaying && (
              <ConfirmButton onClick={handleConfirm} disabled={!isMyTurn}>
                착수
              </ConfirmButton>
            )}
            {!isPlaying && (
              <ConfirmButton
                type="button"
                onClick={() => {
                  setReady((prev) => !prev);
                }}
                disabled={roomInfo.count < 2}
              >
                {ready ? '취소' : '준비하기'}
              </ConfirmButton>
            )}
          </ShadowBox>
        </CanvasProvider>
      </OmokProvider>
    </>
  );
}
