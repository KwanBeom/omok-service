import { Server, Socket } from 'socket.io';
import { EVENT_KEYS } from '../constants/events';
import GameHandler from './GameHandler';
import { ERROR_MESSAGES } from '../constants/messages';

type SocketId = string;
type RoomId = string;
type Room = { players: Socket[]; gameHandler: GameHandler };

class RoomHandler {
  private io: Server;

  // 방과 방에 입장한 유저 및 게임핸들러 관리하는 맵
  private roomsMap: Map<RoomId, Room> = new Map();

  // socket이 어떤 방에 입장해 있는지 소켓id, 방id를 1:1로 매핑해둔 객체
  private roomIdMap: Map<SocketId, RoomId> = new Map();

  constructor(io: Server) {
    this.io = io;
  }

  /* 방에 해당하는 게임 핸들러 받기 */
  getGameHandler(socket: Socket) {
    const roomId = this.roomIdMap.get(socket.id);
    if (!roomId) {
      return undefined;
    }
    return this.roomsMap.get(roomId)?.gameHandler;
  }

  /* 방에 입장한 인원 확인 */
  getUserCount(socket: Socket) {
    const roomId = this.roomIdMap.get(socket.id);
    if (!roomId) {
      return 0;
    }
    return this.roomsMap.get(roomId)?.players.length || 0;
  }

  /* 클라이언트가 속한 방의 유저들을 반환 */
  getUsers(socket: Socket) {
    const roomId = this.roomIdMap.get(socket.id);

    return this.roomsMap.get(roomId || '')?.players;
  }

  /** 소켓이 접속한 방의 아이디를 가져온다. */
  getRoomId(socket: Socket) {
    return this.roomIdMap.get(socket.id);
  }

  /* 방 생성 */
  createRoom(roomId: string, socket: Socket, gameHandler: GameHandler) {
    const exist = this.roomsMap.has(roomId);
    // 방이 이미 존재하는 경우 예외 발생
    if (exist) {
      throw new Error(ERROR_MESSAGES.ALREADY_EXIST_ROOM);
    }

    // 방 생성
    this.roomIdMap.set(socket.id, roomId);
    this.roomsMap.set(roomId, { players: [], gameHandler });
    return true;
  }

  /** 방에 입장 */
  joinRoom(roomId: string, socket: Socket) {
    const haveRoom = this.roomsMap.has(roomId);
    // 방이 없는 경우 클라이언트에게 에러 발생
    if (!haveRoom) {
      throw new Error(ERROR_MESSAGES.INVALID_ROOM);
    }
    // socket을 방에 join
    socket.join(roomId);
    // map 셋팅
    const room = this.roomsMap.get(roomId);

    if (room && room.players.length >= 2) {
      throw new Error(ERROR_MESSAGES.FULL_ROOM);
    }

    if (room) {
      room.players.push(socket);
      this.roomIdMap.set(socket.id, roomId);
      this.broadcast(socket, EVENT_KEYS.ROOM_INFO, { userCount: room.players.length, roomId });

      return room.players.length;
    }

    return 0;
  }

  /* 방에서 퇴장 */
  leaveRoom(socket: Socket) {
    const roomId = this.roomIdMap.get(socket.id);
    if (!roomId) return false;

    const room = this.roomsMap.get(roomId);
    // 방 정보가 존재하지 않으면 퇴장 실패
    if (room === undefined) return false;
    const { players } = room;
    const playerIndex = players.indexOf(socket);
    if (playerIndex !== undefined && playerIndex !== -1) {
      players.splice(playerIndex, 1); // 플레이어 제거
      // 클라이언트에게 방 정보 전송
      this.broadcast(socket, EVENT_KEYS.ROOM_INFO, {
        userCount: players.length,
        roomId,
      });
    }
    // 퇴장 성공
    return true;
  }

  /** socket이 접속해있는 방의 모든 클라이언트에게 이벤트를 발생시키는 브로드캐스팅 메서드 */
  broadcast(socket: Socket, key: string, data?: unknown) {
    const roomId = this.roomIdMap.get(socket.id);
    if (roomId) {
      this.io.to(roomId).emit(key, data);
    }
  }

  /** 방을 삭제하는 메서드 */
  deleteRoom(roomId: string) {
    this.roomIdMap.delete(roomId);
    this.roomsMap.delete(roomId);
  }
}

export default RoomHandler;
