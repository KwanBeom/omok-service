import Position, { IPosition, IPositionTuple, move } from '../entities/Position';
import PositionHelper from '../entities/PositionHelper';
import Board from './Board';

/** 오목 분석 클래스 */
class OmokAnalyzer {
  constructor(private board: Board) {
    this.board = board;
  }

  update(board: Board) {
    this.board = board;
  }

  /** open two인지 확인 */
  checkOpenTwo(two: IPositionTuple<2>) {
    if (this.hasWhite(two)) return false;
    if (!this.bothSideEmpty(two)) return false;

    const positions = PositionHelper.sort(two);
    const [position1, position2] = positions;
    const distance = PositionHelper.getDistance(position1, position2);
    const direction = PositionHelper.getDirection(position1, position2);

    if (distance === 1) return true;

    const innerFirst = move(position1, direction);

    if (distance === 2) return this.board.canDropStone(innerFirst);

    const innerSecond = move(position1, direction, 2);

    if (distance === 3) {
      return this.board.canDropStone(innerFirst) && this.board.canDropStone(innerSecond);
    }

    return false;
  }

  /** open three인지 확인 */
  checkOpenThree(three: IPositionTuple<3>) {
    const positions = PositionHelper.sort(three);

    if (this.hasWhite(positions)) return false;
    if (!this.bothSideEmpty(positions)) return false;
    // 띈 위치에 흑돌이 있는지 확인, 있는 경우 띈 4 조건 성립이기 때문에 false
    if (this.hasGapConnection(positions)) return false;

    const [first, last] = [positions[0], positions[positions.length - 1]];
    const distance = PositionHelper.getDistance(first, last);

    // 붙은 3
    if (distance === 2) return PositionHelper.isSequential(positions);
    // 띈 3
    if (distance === 3) return PositionHelper.isSequentialSkipOnce(positions);

    return false;
  }

  /** open four인지 확인 */
  checkOpenFour(four: IPositionTuple<4>) {
    const positions = PositionHelper.sort(four);

    if (this.hasWhite(positions)) return false;
    if (!this.bothSideEmpty(positions)) return false;
    // 띈 위치에 흑돌이 있는지 확인, 있는 경우 6목이 되기 때문에 false
    if (this.hasGapConnection(positions)) return false;

    const [first, last] = [positions[0], positions[positions.length - 1]];
    const distance = PositionHelper.getDistance(first, last);

    // 붙은 4
    if (distance === 3) return PositionHelper.isSequential(positions);
    // 띈 4
    if (distance === 4) return PositionHelper.isSequentialSkipOnce(positions);

    return false;
  }

  /** 돌 하나를 추가해 오목을 만들 수 있는지 확인 */
  checkFour(four: IPositionTuple<4>) {
    const positions = PositionHelper.sort(four);

    if (this.hasWhite(positions)) return false;

    const [first, last] = [positions[0], positions[positions.length - 1]];
    const distance = PositionHelper.getDistance(first, last);
    const direction = PositionHelper.getDirection(first, last);

    // 붙은 4인 경우 유효한 4인지 확인
    if (distance === 3 && PositionHelper.isSequential(positions)) {
      // 한 방향이라도 열려있는지 확인
      return this.hasOpenSide(positions);
    }

    // 띈 4인 경우 유효한 4인지 확인
    if (distance === 4 && PositionHelper.isSequentialSkipOnce(positions)) {
      // 양 옆이 막혀있어도 괜찮음, 띈 자리에 착수할 수 있는지만 확인
      for (let i = 0; i < positions.length - 1; i += 1) {
        const moved = move(positions[i], direction);
        const next = positions[i + 1];

        if (!(moved.x === next.x && moved.y === next.y)) return this.board.canDropStone(moved);
      }
    }

    return false;
  }

  /** 양 옆이 착수 가능 위치인지 확인 */
  bothSideEmpty(positions: IPosition[]) {
    const [first, last] = [
      new Position(positions[0].x, positions[0].y),
      new Position(positions[positions.length - 1].x, positions[positions.length - 1].y),
    ];
    const direction = PositionHelper.getDirection(first, last);
    const reverse = direction.reverse();

    return (
      this.board.canDropStone(move(first, reverse)) &&
      this.board.canDropStone(move(last, direction))
    );
  }

  /** 한 방향이라도 직접 열려있는지 확인 */
  hasOpenSide(positions: IPositionTuple<2> | IPositionTuple<3> | IPositionTuple<4>) {
    const sortedPositions = PositionHelper.sort(positions);
    const [first, last] = [sortedPositions[0], sortedPositions[sortedPositions.length - 1]];
    const direction = PositionHelper.getDirection(first, last);
    const [beforeFirst, afterLast] = [move(first, direction.reverse()), move(last, direction)];

    return this.board.canDropStone(beforeFirst) || this.board.canDropStone(afterLast);
  }

  /** 흰돌이 있는지 확인 */
  private hasWhite(positions: IPosition[]) {
    return positions.some((position) => this.board.get(position)?.color === 'white');
  }

  /** 띈 위치에 연결된 흑돌이 있는지 확인 */
  private hasGapConnection(positions: IPosition[]) {
    const first = positions[0];
    const last = positions[positions.length - 1];
    const direction = PositionHelper.getDirection(first, last);
    const reverse = direction.reverse();

    return (
      this.board.get(move(first, reverse, 2))?.color === 'black' ||
      this.board.get(move(last, direction, 2))?.color === 'black'
    );
  }
}

export default OmokAnalyzer;
