import { CreateRoomEvent, EVENT_KEYS, JoinRoomEvent } from '@/server/constants/events';
import socket from '@/src/socket';

/* 서버에 방 생성 요청하고 결과 받아오는 함수 */
export const createRoom = (roomId: string): Promise<CreateRoomEvent['serverSend']> => new Promise((resolve) => {
    const createRoomData: CreateRoomEvent['clientSend'] = { roomId };
    socket.emit(EVENT_KEYS.CREATE_ROOM, createRoomData);
    socket.on(EVENT_KEYS.CREATE_ROOM, (data) => resolve(data));
  });

/* 서버에 방 입장 요청하고 결과 받아오는 함수 */
export const joinRoom = (roomId: string): Promise<JoinRoomEvent['serverSend']> => new Promise((resolve) => {
    const joinRoomData: JoinRoomEvent['clientSend'] = { roomId };
    socket.emit(EVENT_KEYS.JOIN_ROOM, joinRoomData);
    socket.on(EVENT_KEYS.JOIN_ROOM, (data) => {
      resolve(data);
    });
  });

/* 서버에 방 퇴장 요청하고 결과 받아오는 함수 */
export const leaveRoom = (roomId: string) => {
  const leaveRoomData: JoinRoomEvent['clientSend'] = { roomId };
  socket.emit(EVENT_KEYS.LEAVE_ROOM, leaveRoomData);
};
