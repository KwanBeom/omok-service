import { Server, Socket } from 'socket.io';
import RoomHandler from './RoomHandler';
import {
  ClientPlayEvent,
  CreateRoomEvent,
  EVENT_KEYS,
  JoinRoomEvent,
  RoomInfoEvent,
} from '../constants/events';
import GameHandler from './GameHandler';
// import OmokGameManager from '../managers/OmokManager';

const setupSocketHandlers = (io: Server) => {
  const roomHandler = new RoomHandler(io);

  // 클라이언트가 연결될 때마다 아래 구문이 실행, on은 이벤트를 받도록 대기
  io.on('connection', (socket) => {
    // 방 생성 처리하고 클라이언트에 데이터 전송
    socket.on(EVENT_KEYS.CREATE_ROOM, ({ roomId }: CreateRoomEvent['clientSend']) => {
      const gameHandler = new GameHandler(io);
      let createRoomData: CreateRoomEvent['serverSend'] = { success: false };

      try {
        roomHandler.createRoom(roomId, socket, gameHandler);
        // 클라이언트에게 성공 여부 전송
        createRoomData = { success: true };
      } catch (e) {
        if (e instanceof Error) {
          createRoomData = { success: false, message: e.message };
        }
      } finally {
        socket.emit(EVENT_KEYS.CREATE_ROOM, createRoomData);
      }
    });

    // 방 입장 처리하고 방에 접속한 클라이언트들에 데이터 전송
    socket.on(EVENT_KEYS.JOIN_ROOM, ({ roomId }: JoinRoomEvent['clientSend']) => {
      try {
        const userCount = roomHandler.joinRoom(roomId, socket);
        // 클라이언트에게 성공 여부 전달
        const joinRoomEventData: JoinRoomEvent['serverSend'] = { success: true };
        socket.emit(EVENT_KEYS.JOIN_ROOM, joinRoomEventData);
        // 방에 입장한 클라이언트들에게 방 정보 전송
        const roomInfoEventData: RoomInfoEvent['serverSend'] = { userCount, roomId };
        roomHandler.broadcast(socket, EVENT_KEYS.ROOM_INFO, roomInfoEventData);
        console.log('입장 정보', roomInfoEventData);
      } catch (e) {
        if (e instanceof Error) {
          const joinRoomData: JoinRoomEvent['serverSend'] = { success: false, message: e.message };
          socket.emit(EVENT_KEYS.JOIN_ROOM, joinRoomData);
        }
      }

      if (roomHandler.getUserCount(socket) === 2) {
        const gameHandler = roomHandler.getGameHandler(socket);
        const players = roomHandler.getUsers(socket);

        if (gameHandler && players) {
          gameHandler.initGame(players as [Socket, Socket]);
        }
      }
    });

    // 방 퇴장 요청 받는 이벤트 리스너
    socket.on(EVENT_KEYS.LEAVE_ROOM, socket.disconnect);

    // 게임 이벤트 받아 게임 핸들러에게 전달
    socket.on(EVENT_KEYS.CLIENT_PLAY, (data: ClientPlayEvent['clientSend']) => {
      const gameHandler = roomHandler.getGameHandler(socket);
      if (!gameHandler) return;
      const gameOver = gameHandler.playGame(data);
      if (gameOver) {
        roomHandler.broadcast(socket, EVENT_KEYS.GAME_OVER);
      }
    });

    // 게임 리셋 이벤트 받아 처리
    socket.on(EVENT_KEYS.GAME_RESET, () => {
      const gameHandler = roomHandler.getGameHandler(socket);
      if (gameHandler) {
        // 게임 초기화 하고 새로 셋팅
        gameHandler.resetGame();
        gameHandler.initGame(roomHandler.getUsers(socket) as [Socket, Socket]);
      }
    });

    // 접속 종료
    socket.on('disconnect', () => {
      roomHandler.leaveRoom(socket);
      const gameHandler = roomHandler.getGameHandler(socket);
      if (gameHandler) gameHandler.resetGame();
    });
  });
};

export default setupSocketHandlers;
