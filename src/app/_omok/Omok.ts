import Board from './Board';
import { HALF_DIRECTIONS } from './constants';
import RenjuRule from './RenjuRule';
import { getStonePointByCount, Position } from './utils';

class Omok {
  private prevPos: Position = { x: 0, y: 0 };

  private board;

  private rule;

  private count;

  constructor() {
    this.board = new Board();
    this.rule = new RenjuRule();
    this.count = 0;
  }

  /**
   * position 위치에 돌을 착수하고 다음 턴으로 넘기는 메서드
   */
  play(position: Position) {
    const { x: row, y: col } = position;

    this.count += 1;

    this.board.dropStone({ x: row, y: col }, getStonePointByCount(this.count));
    this.rule.apply(this.board, { x: row, y: col }, this.count);
    this.prevPos = { x: row, y: col };
  }

  /**
   * 몇 수 진행되었는지 확인하는 메서드
   */
  getCount() {
    return this.count;
  }

  /**
   * 승리 여부 확인 메서드
   */
  checkWin() {
    if (this.count < 9) return false;

    const target = getStonePointByCount(this.count);

    const prev = this.prevPos;

    for (let i = 0; i < HALF_DIRECTIONS.length; i += 1) {
      const count = this.board.countStonesInBothDirections(prev, HALF_DIRECTIONS[i], target);

      if (count >= 5) {
        return true; // 5개 이상의 돌이 연결되면 승리
      }
    }

    return false;
  }

  /** 금수 위치 반환 */
  getGeumsu() {
    return this.rule.getGeumsu();
  }
}

export default Omok;
