import Board from '../Board';
import { HALF_DIRECTIONS } from '../constants';
import OmokAnalyzer from '../OmokAnalyzer';
import { STONE } from '../Stone';
import { createDirection, createPosition, Position, Positions, sortPositions } from '../utils';

type TwoStonePositions = Positions<2>;

/** 렌주룰 3*3 금수 */
class SamsamRule {
  private geumsu: { position: Position; openTwoStones: TwoStonePositions[] }[] = [];

  private board = new Board();

  /** position이 3*3 금수 위치인지 확인 */
  check(board: Board, position: Position) {
    this.board = board;
    const connectedTwos = this.board.findConnectedStones(position, STONE.BLACK.POINT, 2, {
      skip: 2,
    });

    if (connectedTwos.length < 2) return false;

    return this.checkCanSamsam(position, connectedTwos);
  }

  apply(board: Board, position: Position) {
    this.board = board;

    const connectedTwos = this.board.findConnectedStones(position, STONE.BLACK.POINT, 2, {
      skip: 2,
    });
    const canSamsamPositions: Position[] = [];

    for (let i = 0; i < connectedTwos.length; i += 1) {
      if (OmokAnalyzer.checkOpenTwo(this.board, connectedTwos[i])) {
        canSamsamPositions.push(...this.findCanSamsamPositions(connectedTwos[i]));
      }
    }

    for (let j = 0; j < canSamsamPositions.length; j += 1) {
      const canSamsamPosition = canSamsamPositions[j];
      // 3*3 가능 자리 기준 연결된 2 탐색, 그 중 open two
      const openTwoStones = this.board
        .findConnectedStones(canSamsamPosition, STONE.BLACK.POINT, 2, { skip: 2 })
        .filter((target) => OmokAnalyzer.checkOpenTwo(this.board, target));

      // 3*3 가능한 자리가 금수 위치인지 확인 후 추가
      if (this.checkCanSamsam(canSamsamPositions[j], openTwoStones)) {
        this.geumsu.push({
          position: canSamsamPositions[j],
          openTwoStones,
        });
      }
    }

    return this.geumsu.map((data) => data.position);
  }

  haegeum(board: Board) {
    this.board = board;

    this.geumsu = this.geumsu.filter(({ position, openTwoStones }) => {
      if (!this.board.canDropStone(position)) return false;

      const canFiveInARow = this.board.isNConnected(position, STONE.BLACK.POINT, 3, {
        assumeStonePlaced: true,
      });
      if (canFiveInARow) return false;

      return this.checkCanSamsam(position, openTwoStones);
    });

    return this.geumsu.map((data) => data.position);
  }

  /** open two들로 spot 위치가 3*3이 되는지 확인 */
  checkCanSamsam(spot: Position, openTwos: TwoStonePositions[]) {
    if (openTwos.length < 2) return false;

    const filteredOpenTwos = openTwos.filter((openTwo) => {
      const sortedPositions = sortPositions([spot, ...openTwo]);
      const lastIndex = sortedPositions.length - 1;
      const { dx, dy } = OmokAnalyzer.getDirection(sortedPositions[0], sortedPositions[lastIndex]);
      const beforeFirstStone = createPosition(
        sortedPositions[0].x + -dx,
        sortedPositions[0].y + -dy,
      );
      const afterLastStone = createPosition(
        sortedPositions[lastIndex].x + dx,
        sortedPositions[lastIndex].y + dy,
      );

      // 열린 3이고 다음 수순에 열린 4를 만들 수 있는지 확인
      return (
        OmokAnalyzer.checkOpenThree(this.board, [spot, ...openTwo]) &&
        (OmokAnalyzer.checkOpenFour(this.board, [spot, ...openTwo, beforeFirstStone]) ||
          OmokAnalyzer.checkOpenFour(this.board, [spot, ...openTwo, afterLastStone]))
      );
    });

    // 교점에 3*3을 만들 수 있는 조건에 부합하는 돌들이 둘 이상인지 확인
    return filteredOpenTwos.length >= 2;
  }

  /** 3*3 금수 가능한 위치 찾기 */
  private findCanSamsamPositions(twoStones: TwoStonePositions): Position[] {
    const result = [];
    const [pos1, pos2] = twoStones;
    const { x: x1, y: y1 } = pos1;
    const { x: x2, y: y2 } = pos2;
    const { dx, dy } = OmokAnalyzer.getDirection(pos1, pos2);
    const distance = OmokAnalyzer.getDistance(pos1, pos2);

    const nextPos1 = createPosition(x2 + dx, y2 + dy);
    const afterNextPos1 = createPosition(x2 + dx * 2, y2 + dy * 2);

    const nextPos2 = createPosition(x1 + -dx, y1 + -dy);
    const afterNextPos2 = createPosition(x1 + -dx * 2, y1 + -dy * 2);

    const checkOpenThreeWithPosition = (pos: Position) =>
      this.board.canDropStone(pos) && OmokAnalyzer.checkOpenThree(this.board, [pos1, pos2, pos]);

    switch (distance) {
      // 붙은 2 (OO)
      case 1: {
        // 이은 3 위치가 열린 3인지 확인 후 3*3 가능 위치 추가
        if (checkOpenThreeWithPosition(nextPos1)) result.push(nextPos1);
        if (checkOpenThreeWithPosition(nextPos2)) result.push(nextPos2);
        // 띈 3 위치가 열린 3인지 확인 후 3*3 가능 위치 추가
        if (checkOpenThreeWithPosition(afterNextPos1)) result.push(afterNextPos1);
        if (checkOpenThreeWithPosition(afterNextPos2)) result.push(afterNextPos2);

        break;
      }

      // 1칸 띈 2 (OVO)
      case 2: {
        // 띈 2 사이 낀 위치 3*3 가능 위치 추가
        result.push(createPosition(x1 + dx, y1 + dy));

        if (checkOpenThreeWithPosition(nextPos1)) result.push(nextPos1);
        if (checkOpenThreeWithPosition(nextPos2)) result.push(nextPos2);

        break;
      }

      // 2칸 띈 2 (OVVO)
      case 3: {
        // 낀 2개 위치 모두 추가
        result.push(createPosition(x1 + dx, y1 + dy));
        result.push(createPosition(x1 + dx * 2, y1 + dy * 2));

        break;
      }

      default:
        break;
    }

    return result;
  }
}

export default SamsamRule;
