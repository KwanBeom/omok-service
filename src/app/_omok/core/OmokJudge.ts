import Board from './Board';
import { HALF_DIRECTIONS } from '../constants';
import { IPosition } from '../entities/Position';
import { RenjuGeumsu, RenjuRule } from './RenjuRule';

/** 오목 심판 클래스 */
class OmokJudge {
  private rule;

  private board = new Board();

  private geumsu: RenjuGeumsu = { samsam: [], sasa: [], jangmok: [] };

  constructor(rule: RenjuRule) {
    this.rule = rule;
  }

  /** 룰 적용 */
  applyRule(board: Board, position: IPosition) {
    this.board = board;
    this.geumsu = this.rule.apply(board, position);
  }

  /** 금수 위치 반환 */
  getGeumsuPositions(): RenjuGeumsu {
    return this.geumsu;
  }

  /** 승리 여부 확인 */
  checkWin(board: Board, position: IPosition) {
    this.board = board;
    const count = this.board.getStoneCount();

    if (count < 9) return false;

    const target = board.get(position)!.color;

    for (let i = 0; i < HALF_DIRECTIONS.length; i += 1) {
      const stones = this.board.countStonesInBothDirections(position, HALF_DIRECTIONS[i], target);

      if (stones >= 5) return true; // 5개 이상의 돌이 연결되면 승리
    }

    return false;
  }
}

export default OmokJudge;
