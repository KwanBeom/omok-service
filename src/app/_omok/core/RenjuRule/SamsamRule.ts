import Board from '../Board';
import OmokAnalyzer from '../OmokAnalyzer';
import { IPosition, IPositionTuple, move } from '../../entities/Position';
import Positions from '../../entities/Positions';

type TwoStonePositions = IPositionTuple<2>;

export type SamsamGeumsuDatas = { position: IPosition; openTwoStones: TwoStonePositions[] }[];

/** 렌주룰 3*3 금수 */
class SamsamRule {
  private geumsu: SamsamGeumsuDatas = [];

  private board = new Board();

  private analyzer = new OmokAnalyzer(this.board);

  apply(board: Board, position: IPosition) {
    this.board = board;
    this.analyzer.update(board);

    const openTwos = this.findOpenTwos(position);
    const canSamsamPositions: IPosition[] = [];

    for (let i = 0; i < openTwos.length; i += 1) {
      canSamsamPositions.push(...this.findCanSamsamPositions(openTwos[i]));
    }

    for (let j = 0; j < canSamsamPositions.length; j += 1) {
      // 3*3 가능 자리 기준 연결된 2 탐색, 그 중 open two
      const openTwoStones = this.findOpenTwos(canSamsamPositions[j]);

      // 3*3 가능한 자리가 금수 위치인지 확인 후 추가
      if (this.checkCanSamsam(canSamsamPositions[j], openTwoStones)) {
        this.geumsu.push({
          position: canSamsamPositions[j],
          openTwoStones,
        });
      }
    }

    return this.geumsu;
  }

  haegeum(board: Board) {
    this.board = board;

    this.geumsu = this.geumsu.filter(({ position, openTwoStones }) => {
      if (!this.board.canDropStone(position)) return false;

      const canFiveInARow = this.board.isNConnected(position, 'black', 5, {
        assumeStonePlaced: true,
      });

      if (canFiveInARow) return false;

      return this.checkCanSamsam(position, openTwoStones);
    });

    return this.geumsu;
  }

  /** open two들로 spot 위치가 3*3이 되는지 확인 */
  checkCanSamsam(spot: IPosition, twoStones: TwoStonePositions[]) {
    if (twoStones.length < 2) return false;

    const filteredOpenTwos = twoStones.filter((twoStones) => {
      if (!this.analyzer.checkOpenTwo(twoStones)) return false;
      const three: IPositionTuple<3> = [spot, ...twoStones];
      const sortedPositions = this.sortPositions(three);
      const [first, last] = [sortedPositions[0], sortedPositions[sortedPositions.length - 1]];
      const direction = OmokAnalyzer.getDirection(first, last);
      const reverse = direction.reverse();
      const [beforeFirst, afterLast] = [move(first, reverse), move(first, direction)];

      // 열린 3이고 다음 수순에 열린 4를 만들 수 있는지 확인
      return (
        this.analyzer.checkOpenThree([spot, ...twoStones]) &&
        (this.analyzer.checkOpenFour([spot, ...twoStones, beforeFirst]) ||
          this.analyzer.checkOpenFour([spot, ...twoStones, afterLast]))
      );
    });

    // 교점에 3*3을 만들 수 있는 조건에 부합하는 돌들이 둘 이상인지 확인
    return filteredOpenTwos.length >= 2;
  }

  /** 3*3 금수 가능한 위치 찾기 */
  private findCanSamsamPositions(openTwo: TwoStonePositions): IPosition[] {
    const result = [];
    const [first, last] = openTwo;
    const direction = OmokAnalyzer.getDirection(first, last);
    const reverse = direction.reverse();
    const distance = OmokAnalyzer.getDistance(first, last);

    const [beforeFirst, twoBeforeFirst] = [move(first, reverse), move(first, reverse, 2)];
    const [afterLast, twoAfterLast] = [move(last, direction), move(last, direction, 2)];

    const checkOpenThreeWithPosition = (pos: IPosition) =>
      this.board.canDropStone(pos) && this.analyzer.checkOpenThree([first, last, pos]);

    switch (distance) {
      // 붙은 2 (OO)
      case 1: {
        // 이은 3 위치가 열린 3인지 확인 후 3*3 가능 위치 추가
        if (checkOpenThreeWithPosition(afterLast)) result.push(afterLast);
        if (checkOpenThreeWithPosition(beforeFirst)) result.push(beforeFirst);
        // 띈 3 위치가 열린 3인지 확인 후 3*3 가능 위치 추가
        if (checkOpenThreeWithPosition(twoBeforeFirst)) result.push(twoBeforeFirst);
        if (checkOpenThreeWithPosition(twoAfterLast)) result.push(twoAfterLast);

        break;
      }

      // 1칸 띈 2 (OVO)
      case 2: {
        // 띈 2 사이 낀 위치 3*3 가능 위치 추가
        result.push(move(first, direction));

        if (checkOpenThreeWithPosition(afterLast)) result.push(afterLast);
        if (checkOpenThreeWithPosition(beforeFirst)) result.push(beforeFirst);

        break;
      }

      // 2칸 띈 2 (OVVO)
      case 3: {
        // 낀 2개 위치 모두 추가
        result.push(move(first, direction));
        result.push(move(first, direction, 2));

        break;
      }

      default:
        break;
    }

    return result;
  }

  private findOpenTwos(position: IPosition) {
    return this.board
      .findConnectedStones(position, 'black', 2, { skip: 2 })
      .filter((target) => this.analyzer.checkOpenTwo(target));
  }

  private sortPositions<N extends IPosition[]>(positions: N): IPositionTuple<N['length']> {
    const position = new Positions(...positions);
    position.sort();

    return position.getAll();
  }
}

export default SamsamRule;
