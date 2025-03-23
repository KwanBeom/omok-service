import { Position } from '@/src/app/game/types/Position';
import { RenjuGeumsu } from '../omok/core/RenjuRule';
import Stone from '../omok/entities/Stone';

export const EVENT_KEYS = {
  // socket 연결 및 종료 관련
  CONNECT_SOCKET: 'CONNECT_SOCKET',
  DISCONNECT_SOCKET: 'DISCONNECT_SOCKET',
  // 게임 시작/종료 관련
  GAME_START: 'GAME_START',
  GAME_OVER: 'GAME_OVER',
  GAME_READY: 'GAME_READY',
  GAME_RESET: 'GAME_RESET',
  // 방 관련
  CREATE_ROOM: 'CREATE_ROOM',
  JOIN_ROOM: 'JOIN_ROOM',
  LEAVE_ROOM: 'LEAVE_ROOM',
  ROOM_INFO: 'ROOM_INFO',
  FULL_ROOM: 'FULL_ROOM',
  // 게임 진행 관련
  READY: 'READY',
  CLIENT_PLAY: 'CLIENT_PLAY',
  SERVER_PLAY: 'SERVER_PLAY',
  ASSIGN_STONE_COLOR: 'ASSIGN_STONE_COLOR',
  // 에러 관련
  ERROR: 'ERROR',
} as const;

// Event 객체 생성자 타입
type EventTemplate<
  K extends string,
  ServerSend extends Record<string, unknown> | never,
  ClientSend extends Record<string, unknown> | never,
> = {
  key: K;
  serverSend: ServerSend;
  clientSend: ClientSend;
};

export type TEventKeys = typeof EVENT_KEYS;

// ------------------ socket 연결 종료 관련 이벤트 데이터 타입 -------------------------
export type SocketConnectEvent = EventTemplate<TEventKeys['CONNECT_SOCKET'], never, never>;
export type SocketDisconnectEvent = EventTemplate<TEventKeys['DISCONNECT_SOCKET'], never, never>;
// ----------------- 게임 시작/종료 관련 이벤트 데이터 타입 -------------------
export type GameStartEvent = EventTemplate<
  TEventKeys['GAME_START'],
  { color: Stone['point'] },
  never
>;
export type GameResetEvent = EventTemplate<TEventKeys['GAME_RESET'], { message?: string }, never>;
export type GameOverEvent = EventTemplate<
  TEventKeys['GAME_OVER'],
  { winner: Stone['point'] },
  never
>;
// ------------------- 방 관련 이벤트 이벤트 데이터 타입 -----------------------
export type CreateRoomEvent = EventTemplate<
  TEventKeys['CREATE_ROOM'],
  { success: boolean; message?: string },
  { roomId: string }
>;
export type RoomInfoEvent = EventTemplate<
  TEventKeys['ROOM_INFO'],
  { userCount: number; roomId: string },
  never
>;
export type JoinRoomEvent = EventTemplate<
  TEventKeys['JOIN_ROOM'],
  { success: boolean; message?: string },
  { roomId: string }
>;
export type LeaveRoomEvent = EventTemplate<TEventKeys['LEAVE_ROOM'], never, { roomId: string }>;
// -------------------- 게임 진행 관련 이벤트 데이터 타입 -----------------------
export type ClientPlayEvent = EventTemplate<
  TEventKeys['CLIENT_PLAY'],
  never,
  {
    position: Position;
    userColor: Stone['point'];
  }
>;
export type ServerPlayEvent = EventTemplate<
  TEventKeys['SERVER_PLAY'],
  {
    position: Position; // 돌이 놓아진 위치
    stoneColor: Stone['point']; // 놓아진 돌의 색상
    turn: Stone['point']; // 이번 턴이 누군지
    geumsu: RenjuGeumsu;
  },
  never
>;
export type ReadyEvent = EventTemplate<TEventKeys['READY'], never, { ready: boolean }>;
// ------------------- 에러 관련 이벤트 데이터 타입 --------------------
export type ErrorEvent = EventTemplate<
  TEventKeys['ERROR'],
  { message?: string; code?: number },
  never
>;
