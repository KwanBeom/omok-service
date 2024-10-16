import Board from './Board';
import OmokJudge from './OmokJudge';
import Stone, { StoneColor } from '../entities/Stone';
import { RenjuRule } from './RenjuRule';
import Position from '../entities/Position';

class Omok {
  private board = new Board();

  private count = 0;

  private judge = new OmokJudge(new RenjuRule());

  private moveSequence: Stone[] = [];

  /**
   * position 위치에 돌을 착수하고 다음 턴으로 넘기는 메서드
   */
  play(x: number, y: number) {
    const stone = new Stone(Omok.getStoneColorByCount(this.count), x, y);
    const position = new Position(x, y);

    this.count += 1;
    this.moveSequence.push(stone);
    this.board.dropStone(position, Omok.getStoneColorByCount(this.count));
    this.judge.applyRule(this.board, position);
  }

  // TODO: 되돌리기 기능 추가

  /** 몇 수 진행되었는지 확인 */
  getCount() {
    return this.count;
  }

  /** 승리 여부 확인 */
  checkWin() {
    const lastMove = this.moveSequence[this.moveSequence.length - 1];

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
