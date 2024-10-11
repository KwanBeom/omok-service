import Board from '../../core/Board';
import OmokAnalyzer from '../../core/OmokAnalyzer';
import Position, { PositionTuple } from '../../entities/Position';
import Positions from '../../entities/Positions';
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

    // this.board.view();s

    if (isBlackTurn) {
      this.geumsu.sasa = this.rules.sasa.apply(board, position);
      this.geumsu.jangmok = this.rules.jangmok.apply(board, position);
      this.geumsu.samsam = this.filterFakeGeumsu(this.rules.samsam.apply(board, position));
    }

    this.geumsu.sasa = this.rules.sasa.haegeum(board);
    this.geumsu.jangmok = this.rules.jangmok.haegeum(board);
    this.geumsu.samsam = this.filterFakeGeumsu(this.rules.samsam.haegeum(board));

    return this.geumsu;
  }

  /** 거짓 금수 필터링 */
  private filterFakeGeumsu(samsamGeumsuPositions: Position[]) {
    // 거짓 2 필터링 데이터
    const filteredSamsamGeumsuData = samsamGeumsuPositions.filter((position) => {
      const connectedTwos = this.board.findConnectedStones(position, 'black', 2, { skip: 1 });
      const openTwos = connectedTwos.filter((connectedTwo) =>
        OmokAnalyzer.checkOpenTwo(this.board, connectedTwo),
      );
      const filteredOpenTwos = openTwos.filter(
        (openTwo) => !this.isFakeThree([position, ...openTwo]),
      );

      // 열린 2의 수가 2개 이상인지 확인, 미만인 경우 거짓 금수
      return filteredOpenTwos.length >= 2;
    });

    return filteredSamsamGeumsuData;
  }

  private isGeumsu(position: Position) {
    return (
      this.geumsu.samsam.some((geumsu) => geumsu.isSame(position)) ||
      this.geumsu.sasa.some((geumsu) => geumsu.isSame(position)) ||
      this.geumsu.jangmok.some((geumsu) => geumsu.isSame(position))
    );
  }

  /** 3*3 금수를 구성하는 3 중에서 가짜 3 판별 */
  private isFakeThree(three: PositionTuple<3>) {
    /** 해당 위치에 4를 만들 수 있는지 확인 */
    const canMakeFour = (position: Position) =>
      this.board.isNConnected(position, 'black', 4, {
        assumeStonePlaced: true,
      });

    /** 거짓 띈 3 판별 */
    const checkDistanceThree = (sortedPositions: PositionTuple<3>) => {
      const skipPosition = OmokAnalyzer.getSkippedPosition(sortedPositions)[0];
      const [first, third] = [sortedPositions[0], sortedPositions[sortedPositions.length - 1]];
      const direction = Positions.getDirection(first, third);
      const reverse = direction.reverse();
      const [beforeFirst, nextThird] = [
        first.move(reverse.dx, reverse.dy),
        third.move(direction.dx, direction.dy),
      ];

      // 양쪽이 모두 금수인 경우 거짓 금수
      if (this.isGeumsu(beforeFirst) && this.isGeumsu(nextThird)) return true;

      // 띈 3으로 4를 만드는 경우 4*4 금수가 성립하는지 확인, 가능한 경우 거짓 금수
      return canMakeFour(skipPosition);
    };

    /** 거짓 3 판별 */
    const checkDistanceTwo = (sortedPositions: PositionTuple<3>) => {
      const [first, third] = [sortedPositions[0], sortedPositions[sortedPositions.length - 1]];
      const direction = Positions.getDirection(first, third);
      const { dx, dy } = direction;
      const { dx: rdx, dy: rdy } = direction.reverse();
      const [beforeFirst, beforeLastFirst] = [first.move(rdx, rdy), first.move(rdx, rdy, 2)];
      const [nextThird, afterNextThird] = [third.move(dx, dy), third.move(dx, dy, 2)];

      const isOpenFour = (position: Position) =>
        OmokAnalyzer.checkOpenFour(this.board, [...sortedPositions, position]);

      const isBlocked = (position: Position) => !this.board.canDropStone(position);

      const isFourConnected = (position: Position) =>
        this.board.isNConnected(position, 'black', 4, { assumeStonePlaced: true });

      // 양쪽 모두 금수인 경우 거짓 금수
      if (this.isGeumsu(beforeFirst) && this.isGeumsu(nextThird)) return true;
      // 한쪽은 금수, 한쪽은 장목인 경우 거짓 금수
      if (this.isGeumsu(beforeFirst) && !isOpenFour(nextThird)) return true;
      if (this.isGeumsu(nextThird) && !isOpenFour(beforeFirst)) return true;

      // 한쪽이 막혀있는 경우, 다음 수순에 4*4 금수가 만들어지는지
      const nextStepIsSasa =
        (isBlocked(beforeLastFirst) && isFourConnected(nextThird)) ||
        (isBlocked(afterNextThird) && isFourConnected(beforeFirst));

      if (nextStepIsSasa) return true;

      return false;
    };

    const positions = new Positions(...three);
    positions.sort();
    const sortedPositions = positions.getAll();
    const [first, third] = [sortedPositions[0], sortedPositions[sortedPositions.length - 1]];
    const distance = Positions.getDistance(first, third);

    // 거짓 금수가 될 수 있는지 체크
    if (distance === 3) return checkDistanceThree(sortedPositions);
    if (distance === 2) return checkDistanceTwo(sortedPositions);

    return false;
  }
}

export default RenjuRule;
