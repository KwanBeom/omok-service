import Board from './Board';
import Position from '../entities/Position';
import OmokJudge from './OmokJudge';
import { StoneColor } from '../entities/Stone';
import { RenjuRule } from '../rules/RenjuRule';

class Omok {
  private prevPos: Position = new Position(0, 0);

  private board = new Board();

  private count = 0;

  private judge = new OmokJudge(new RenjuRule());

  /**
   * position 위치에 돌을 착수하고 다음 턴으로 넘기는 메서드
   */
  play(position: Position) {
    this.count += 1;
    this.board.dropStone(position, Omok.getStoneColorByCount(this.count));
    this.judge.applyRule(this.board, position);
    this.prevPos = position;
  }

  /** 몇 수 진행되었는지 확인 */
  getCount() {
    return this.count;
  }

  /** 승리 여부 확인 */
  checkWin() {
    return this.judge.checkWin(this.board, this.prevPos);
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
