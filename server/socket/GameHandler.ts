import { Server, Socket } from 'socket.io';
import { EVENT_KEYS, ClientPlayEvent, ServerPlayEvent, GameStartEvent } from '../constants/events';
import Omok from '../omok/core/Omok';
import { BLACK, WHITE } from '../constants/player';
import { STONE } from '../types/stone';
import { getShuffledStones } from '../lib/utils';

class GameHandler {
  private TURN_TIME = 30;

  private players: Socket[];

  private io: Server;

  private omok: Omok;

  protected roomId = '';

  private timerId: NodeJS.Timeout | null = null;

  constructor(io: Server) {
    this.io = io;
    this.omok = new Omok();
    this.players = [];
  }

  /** 방에 접속한 유저 수 반환 */
  getUserCount() {
    return this.players.length;
  }

  /** 승리한 유저 반환 */
  getWinner() {
    return this.omok.getCurrentTurn() === BLACK ? WHITE : BLACK;
  }

  /** 게임 초기화, 플레이어에게 돌 색깔 할당 */
  initGame() {
    const colors: STONE[] = getShuffledStones();
    // 플레이어들에게 돌 색 할당
    this.players.forEach((player, index) => {
      const data: GameStartEvent['serverSend'] = { color: colors[index] };
      player.emit(EVENT_KEYS.GAME_START, data);
    });
    this.setTimer();
  }

  /** 게임 리셋 */
  resetGame() {
    this.omok = new Omok();
  }

  /** 게임 진행 */
  playGame(data: ClientPlayEvent['clientSend']) {
    const { position, userColor } = data;
    if (userColor !== this.omok.getCurrentTurn()) {
      throw new Error('올바르지 않은 사용자가 착수했습니다.');
    }
    this.clearTimer();
    this.omok.play(position.x, position.y);
    const turn = this.omok.getCurrentTurn();
    const playData: ServerPlayEvent['serverSend'] = {
      position,
      geumsu: this.omok.getGeumsu(),
      stoneColor: turn === BLACK ? WHITE : BLACK,
      turn,
    };
    this.broadcast(EVENT_KEYS.SERVER_PLAY, playData);
    this.setTimer();

    return this.omok.checkWin();
  }

  /** 게임 준비완료 처리 */
  readyGame(socket: Socket, ready: boolean) {
    if (ready) {
      const users = this.players.push(socket);
      if (users === 2) {
        this.initGame();
      }
    } else {
      this.players = this.players.filter((player) => player.id !== socket.id);
    }
  }

  /** 클라이언트들에게 메시지 전송 */
  private broadcast(key: string, data: unknown) {
    this.players.forEach((player) => player.emit(key, data));
  }

  /** 턴 시간제한 타이머 설정 */
  private setTimer() {
    this.timerId = setTimeout(() => {
      this.broadcast(EVENT_KEYS.GAME_OVER, {
        winner: this.omok.getCurrentTurn() === BLACK ? WHITE : BLACK,
      });
    }, 1000 * this.TURN_TIME);
  }

  /** 턴 시간제한 타이머 해제 */
  private clearTimer() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null; // 중복 실행 방지
    }
  }
}

export default GameHandler;
