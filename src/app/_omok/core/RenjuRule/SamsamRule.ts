import Board from '../Board';
import OmokAnalyzer from '../OmokAnalyzer';
import {
  deserializePosition,
  IPosition,
  IPositionTuple,
  move,
  serializePosition,
} from '../../entities/Position';
import PositionHelper from '../../entities/PositionHelper';

type TwoStonePositions = IPositionTuple<2>;

export type SamsamGeumsuDatas = { position: IPosition; openTwoStones: TwoStonePositions[] }[];

/** 렌주룰 3*3 금수 */
class SamsamRule {
  private geumsu = new Map<string, TwoStonePositions[]>();

  private board = new Board();

  private analyzer = new OmokAnalyzer(this.board);

  apply(board: Board, position: IPosition): SamsamGeumsuDatas {
    this.board = board;
    this.analyzer.update(board);

    const openTwos = this.findOpenTwos(position);
    const canSamsamPositions: IPosition[] = [];

    for (let i = 0; i < openTwos.length; i += 1) {
      canSamsamPositions.push(...this.findCanSamsamPositions(openTwos[i]));
    }

    for (let j = 0; j < canSamsamPositions.length; j += 1) {
      const canSamsamPosition = canSamsamPositions[j];
      const openTwoStones = this.findOpenTwos(canSamsamPosition);

      // position을 문자열로 변환하여 Map의 키로 사용
      const positionKey = serializePosition(canSamsamPosition);

      if (this.checkCanSamsam(canSamsamPosition, openTwoStones)) {
        const isExistGeumsuPosition = this.geumsu.has(positionKey);
        const existOpenTwos = this.geumsu.get(positionKey);

        this.geumsu.set(
          positionKey,
          isExistGeumsuPosition
            ? PositionHelper.removeDuplicatePositionArray([...existOpenTwos!, ...openTwoStones]) // 중복 제거
            : openTwoStones,
        );
      }
    }

    return [...this.geumsu].map(([key, value]) => ({
      position: deserializePosition(key),
      openTwoStones: value,
    }));
  }

  haegeum(board: Board): SamsamGeumsuDatas {
    this.board = board;

    this.geumsu.forEach((openTwoStones, positionKey) => {
      const position = deserializePosition(positionKey);
      const canDrop = this.board.canDropStone(position);

      if (!canDrop) {
        this.geumsu.delete(positionKey);
        return;
      }

      const canFiveInARow = this.board.isNConnected(position, 'black', 5, {
        assumeStonePlaced: true,
      });

      if (canFiveInARow) {
        this.geumsu.delete(positionKey);
        return;
      }

      if (!this.checkCanSamsam(position, openTwoStones)) this.geumsu.delete(positionKey);
    });

    return [...this.geumsu].map(([key, value]) => ({
      position: deserializePosition(key),
      openTwoStones: value,
    }));
  }

  /** twoStones들로 spot 위치가 3*3이 되는지 확인 */
  checkCanSamsam(spot: IPosition, twoStones: TwoStonePositions[]) {
    if (twoStones.length < 2) return false;

    const filteredOpenTwos = twoStones.filter((twoStone) => {
      if (!this.analyzer.checkOpenTwo(twoStone)) return false;
      if (twoStone.some((position) => this.board.get(position) === Board.EMPTY)) return false;

      const three: IPositionTuple<3> = [spot, ...twoStone];

      const sortedPositions = PositionHelper.sort(three);
      const [first, last] = [sortedPositions[0], sortedPositions[sortedPositions.length - 1]];
      const direction = PositionHelper.getDirection(first, last);
      const reverse = direction.reverse();
      const [beforeFirst, afterLast] = [move(first, reverse), move(last, direction)];

      // 열린 3이고 다음 수순에 열린 4를 만들 수 있는지 확인
      return (
        this.analyzer.checkOpenThree([spot, ...twoStone]) &&
        (this.analyzer.checkOpenFour([spot, ...twoStone, beforeFirst]) ||
          this.analyzer.checkOpenFour([spot, ...twoStone, afterLast]))
      );
    });

    // 교점에 3*3을 만들 수 있는 조건에 부합하는 돌들이 둘 이상인지 확인
    return filteredOpenTwos.length >= 2;
  }

  /** 3*3 금수 가능한 위치 찾기 */
  private findCanSamsamPositions(openTwo: TwoStonePositions): IPosition[] {
    const result = [];
    const [first, last] = openTwo;
    const direction = PositionHelper.getDirection(first, last);
    const reverse = direction.reverse();
    const distance = PositionHelper.getDistance(first, last);

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
}

export default SamsamRule;
