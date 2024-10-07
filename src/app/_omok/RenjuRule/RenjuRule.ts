import Board from '../Board';
import { STONE } from '../Stone';
import { getStonePointByCount, Position } from '../utils';
import JangmokRule from './JangmokRule';
import SamsamRule from './SamsamRule';
import SasaRule from './SasaRule';

export type RenjuGeumsu = {
  sasa: Position[];
  samsam: Position[];
  jangmok: Position[];
};

/** 렌주 룰 */
class RenjuRule {
  private rules = { samsam: new SamsamRule(), sasa: new SasaRule(), jangmok: new JangmokRule() };

  private geumsu: RenjuGeumsu = { samsam: [], sasa: [], jangmok: [] };

  private board: Board = new Board();

  /** 룰 적용 */
  apply(board: Board, position: Position) {
    this.board = board;
    const count = board.getStoneCount();
    const isBlackTurn = getStonePointByCount(count) === STONE.BLACK.POINT;

    if (count >= 6) {
      this.geumsu.samsam = this.rules.samsam.haegeum(board);
      this.geumsu.sasa = this.rules.sasa.haegeum(board);

      if (isBlackTurn) {
        this.geumsu.sasa = this.rules.sasa.apply(board, position);
        this.geumsu.samsam = this.rules.samsam.apply(board, position);
        this.geumsu.jangmok = this.rules.jangmok.apply(board, position);

        for (let i = 0; i < this.geumsu.sasa.length; i += 1) {
          // if (this.checkFakeGeumsu(this.geumsu.sasa[i])) {
          // }
        }
        // 거짓 금수 체크 및 적용
      }
    }

    return this.geumsu;
  }

  private checkFakeSamsamGeumsu(geumsuPosition: Position) {
    return this.rules.sasa.check(this.board, geumsuPosition);
  }

  private checkFakeSasaGeumsu(geumsuPosition: Position) {
    return this.rules.samsam.check(this.board, geumsuPosition);
  }
}

export default RenjuRule;
