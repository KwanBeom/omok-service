import Board from './Board';
import OmokJudge from './OmokJudge';
import Stone from '../entities/Stone';
import { RenjuRule } from './RenjuRule';
import Position from '../entities/Position';
import HistoryManager from './HistoryManager';

class Omok {
  readonly board = new Board();

  private judge = new OmokJudge(new RenjuRule());

  private historyManager = new HistoryManager();

  getGeumsu() {
    return this.judge.getGeumsuPositions();
  }

  getCurrentTurn() {
    return this.judge.getCurrentTurn();
  }

  getBoard() {
    return this.board.getBoard();
  }

  play(x: number, y: number) {
    const currentTurnColor = Stone.pointToColor(this.judge.getCurrentTurn());
    const stone = new Stone(currentTurnColor, x, y);
    const position = new Position(x, y);
    this.board.dropStone(position, currentTurnColor);
    this.judge.applyRule(this.board, position);
    this.historyManager.addMove(stone);
  }

  undo() {
    const lastMove = this.historyManager.undoMove();
    if (!lastMove) return;
    this.board.removeStone(lastMove);
    const prevMove = this.historyManager.getLastMove();
    this.judge.applyRule(this.board, prevMove);
  }

  checkWin() {
    const lastMove = this.historyManager.getLastMove();
    if (!lastMove) return false;
    return this.judge.checkWin(this.board, lastMove);
  }

  isValidTurn(turn: Stone['point']) {
    return this.judge.getCurrentTurn() === turn;
  }
}

export default Omok;
