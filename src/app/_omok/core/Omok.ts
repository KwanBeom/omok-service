import Board from './Board';
import OmokJudge from './OmokJudge';
import Stone, { StoneColor } from '../entities/Stone';
import { RenjuRule } from './RenjuRule';
import Position from '../entities/Position';

class Omok {
  readonly board = new Board();

  private judge = new OmokJudge(new RenjuRule());

  private moveHistory: Stone[] = [];

  /**
   * position 위치에 돌을 착수하고 다음 턴으로 넘기는 메서드
   */
  play(x: number, y: number) {
    const count = this.moveHistory.length + 1;
    const stone = new Stone(Omok.getStoneColorByCount(count), x, y);
    const position = new Position(x, y);

    this.board.dropStone(position, Omok.getStoneColorByCount(count));
    this.judge.applyRule(this.board, position);
    this.moveHistory.push(stone);
  }

  /** 되돌리기 */
  undo() {
    const lastMove = this.moveHistory.pop();

    if (!lastMove) return;

    this.board.removeStone(lastMove);

    this.judge.applyRule(this.board, this.moveHistory[this.moveHistory.length - 2]);
  }

  /** 몇 수 진행되었는지 확인 */
  getCount() {
    return this.moveHistory.length;
  }

  /** 승리 여부 확인 */
  checkWin() {
    const lastMove = this.moveHistory[this.moveHistory.length - 1];

    if (!lastMove) return false;

    return this.judge.checkWin(this.board, lastMove);
  }

  /** 금수 위치 반환 */
  getGeumsu() {
    return this.judge.getGeumsuPositions();
  }

  static getStoneColorByCount(count: number): StoneColor {
    return count % 2 === 1 ? 'black' : 'white';
  }
}

export default Omok;
