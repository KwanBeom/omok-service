import Board from './Board';
import OmokJudge from './OmokJudge';
import RenjuRule from './RenjuRule/RenjuRule';
import { getStonePointByCount, Position } from './utils';

class Omok {
  private prevPos: Position = { x: 0, y: 0 };

  private board = new Board();

  private count = 0;

  private judge = new OmokJudge(new RenjuRule());

  /**
   * position 위치에 돌을 착수하고 다음 턴으로 넘기는 메서드
   */
  play(position: Position) {
    const { x: row, y: col } = position;
    this.count += 1;
    this.board.dropStone({ x: row, y: col }, getStonePointByCount(this.count));
    this.judge.applyRule(this.board, { x: row, y: col });
    this.prevPos = { x: row, y: col };
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
}

export default Omok;
