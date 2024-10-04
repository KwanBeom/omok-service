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

  /** 룰 적용 */
  apply(board: Board, position: Position) {
    const geumsu: RenjuGeumsu = { samsam: [], sasa: [], jangmok: [] };
    const count = board.getStoneCount();
    const isBlackTurn = getStonePointByCount(count) === STONE.BLACK.POINT;

    if (count >= 6) {
      geumsu.samsam = this.rules.samsam.haegeum(board);
      geumsu.sasa = this.rules.sasa.haegeum(board);

      if (isBlackTurn) {
        geumsu.sasa = this.rules.sasa.apply(board, position);
        geumsu.samsam = this.rules.samsam.apply(board, position);
        geumsu.jangmok = this.rules.jangmok.apply(board, position);
      }
    }

    return geumsu;
  }
}

export default RenjuRule;
