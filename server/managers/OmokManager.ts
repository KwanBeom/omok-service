import { Socket } from 'socket.io';
import { BLACK, WHITE } from '../constants/player';
import Omok from '../omok/core/Omok';

class OmokGameManager {
  private players: Socket[] = [];

  private gameCore: Omok;

  constructor() {
    this.gameCore = new Omok();
  }

  addPlayer(socket: Socket) {
    this.players.push(socket);
  }

  removePlayer(socket: Socket) {
    this.players = this.players.filter((player) => player !== socket);
  }

  getPlayersInRoom() {
    return this.players.length;
  }

  isReadyToStart() {
    return this.players.length === 2;
  }

  startGame(players: [Socket, Socket]) {
    console.log('두명이 입장하고 룸 핸들러에서 오목 매니저의 게임 시작을 호출한거야!');
    const colors = [BLACK, WHITE];
    this.players = players;
    this.players.forEach((player, index) => {
      player.emit('ASSIGN_STONE_COLOR', colors[index]);
    });
    // this.broadcast('GAME_START', { roomId: this.roomId });
  }

  playMove(socket: Socket, position: { x: number; y: number }) {
    const color = this.getPlayerColor(socket);
    if (!this.gameCore.isValidTurn(color)) {
      socket.emit('ERROR', 'Not your turn');
      return;
    }

    this.gameCore.play(position.x, position.y);
    this.broadcast('PLAY', { geumsu: this.gameCore.getGeumsu() });

    if (this.gameCore.checkWin()) {
      this.broadcast('GAME_OVER', { winner: this.gameCore.getCurrentTurn() });
    }
  }

  private broadcast(event: string, data: unknown) {
    this.players.forEach((player) => player.emit(event, data));
  }

  private getPlayerColor(socket: Socket) {
    const index = this.players.indexOf(socket);
    return index === 0 ? BLACK : WHITE;
  }
}

export default OmokGameManager;
