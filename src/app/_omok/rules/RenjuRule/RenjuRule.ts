import Board from '../../core/Board';
import Position from '../../entities/Position';
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
    const isBlackTurn = board.get(position)?.color === 'black';

    if (count < 6) return this.geumsu;

    // this.board.view();

    if (isBlackTurn) {
      this.geumsu.samsam = this.rules.samsam.apply(board, position);
      this.geumsu.sasa = this.rules.sasa.apply(board, position);
      this.geumsu.jangmok = this.rules.jangmok.apply(board, position);
    }

    this.geumsu.samsam = this.rules.samsam.haegeum(board);
    this.geumsu.sasa = this.rules.sasa.haegeum(board);
    this.geumsu.jangmok = this.rules.jangmok.haegeum(board);

    return this.geumsu;
  }
}

export default RenjuRule;
