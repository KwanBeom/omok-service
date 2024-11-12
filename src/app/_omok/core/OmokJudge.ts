import Board from './Board';
import { IPosition } from '../entities/Position';
import { RenjuGeumsu, RenjuRule } from './RenjuRule';
import Direction from '../entities/Direction';
import { StoneColor } from '../entities/Stone';

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

    const halfDirections = Direction.getHalf();

    for (let i = 0; i < halfDirections.length; i += 1) {
      const stones = this.board.countStonesInBothDirections(position, halfDirections[i], target);

      if (stones >= 5) return true; // 5개 이상의 돌이 연결되면 승리
    }

    return false;
  }

  /** 현재 턴에 착수해야 할 돌의 색을 반환 */
  getCurrentStoneColor(): StoneColor {
    return this.board.getStoneCount() % 2 === 0 ? 'black' : 'white';
  }
}

export default OmokJudge;
