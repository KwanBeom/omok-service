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

  play(x: number, y: number) {
    const stone = new Stone(this.judge.getCurrentStoneColor(), x, y);
    const position = new Position(x, y);
    this.board.dropStone(position, this.judge.getCurrentStoneColor());
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

  getGeumsu() {
    return this.judge.getGeumsuPositions();
  }

  getCurrentTurn() {
    return this.judge.getCurrentStoneColor();
  }
}

export default Omok;
