import { Server, Socket } from 'socket.io';
import {
  EVENT_KEYS,
  ClientPlayEvent,
  ServerPlayEvent,
  AssignStoneColorEvent,
} from '../constants/events';
import Omok from '../omok/core/Omok';
import { BLACK, WHITE } from '../constants/player';
import { STONE } from '../types/stone';
import { getShuffledStones } from '../lib/utils';

class GameHandler {
  private players: Socket[];

  private io: Server;

  private omok: Omok;

  protected roomId = '';

  constructor(io: Server) {
    this.io = io;
    this.omok = new Omok();
    this.players = [];
  }

  /** 방에 접속한 유저 수 반환 */
  getUserCount() {
    return this.players.length;
  }

  /** 게임 초기화, 플레이어에게 돌 색깔 할당 */
  initGame(players: [Socket, Socket]) {
    console.log('init');
    const colors: STONE[] = getShuffledStones();
    this.players = players;

    // 플레이어들에게 돌 색 할당
    this.players.forEach((player, index) => {
      const data: AssignStoneColorEvent['serverSend'] = { color: colors[index] };
      player.emit(EVENT_KEYS.ASSIGN_STONE_COLOR, data);
    });
  }

  /** 게임 리셋 */
  resetGame() {
    this.omok = new Omok();
  }

  /** 게임 진행 */
  playGame(data: ClientPlayEvent['clientSend']) {
    const { position, userColor } = data;
    console.log(userColor, this.omok.getCurrentTurn());
    if (userColor !== this.omok.getCurrentTurn()) {
      throw new Error('올바르지 않은 사용자가 착수했습니다.');
    }

    this.omok.play(position.x, position.y);
    const turn = this.omok.getCurrentTurn();
    const playData: ServerPlayEvent['serverSend'] = {
      position,
      geumsu: this.omok.getGeumsu(),
      stoneColor: turn === BLACK ? WHITE : BLACK,
      turn,
    };
    this.broadcast(EVENT_KEYS.SERVER_PLAY, playData);

    return this.omok.checkWin();
  }

  /** 클라이언트들에게 메시지 전송 */
  private broadcast(key: string, data: unknown) {
    this.players.forEach((player) => player.emit(key, data));
  }
}

export default GameHandler;
