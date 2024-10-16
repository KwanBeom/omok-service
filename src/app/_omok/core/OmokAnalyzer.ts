import Position, { IPosition, IPositionTuple, move } from '../entities/Position';
import Direction, { IDirection } from '../entities/Direction';
import Positions from '../entities/Positions';
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

    const positions = this.sortPositions(two);
    const [position1, position2] = positions;
    const distance = OmokAnalyzer.getDistance(position1, position2);
    const direction = OmokAnalyzer.getDirection(position1, position2);

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
    const positions = this.sortPositions(three);

    if (this.hasWhite(positions)) return false;
    if (!this.bothSideEmpty(positions)) return false;
    // 띈 위치에 흑돌이 있는지 확인, 있는 경우 띈 4 조건 성립이기 때문에 false
    if (this.hasGapConnection(positions)) return false;

    const [first, last] = [positions[0], positions[positions.length - 1]];
    const distance = OmokAnalyzer.getDistance(first, last);

    // 붙은 3
    if (distance === 2) return Positions.isSequential(positions);
    // 띈 3
    if (distance === 3) return Positions.isSequentialSkipOnce(positions);

    return false;
  }

  /** open four인지 확인 */
  checkOpenFour(four: IPositionTuple<4>) {
    const positions = this.sortPositions(four);

    if (this.hasWhite(positions)) return false;
    if (!this.bothSideEmpty(positions)) return false;
    // 띈 위치에 흑돌이 있는지 확인, 있는 경우 6목이 되기 때문에 false
    if (this.hasGapConnection(positions)) return false;

    const [first, last] = [positions[0], positions[positions.length - 1]];
    const distance = OmokAnalyzer.getDistance(first, last);

    // 붙은 4
    if (distance === 3) return Positions.isSequential(positions);
    // 띈 4
    if (distance === 4) return Positions.isSequentialSkipOnce(positions);

    return false;
  }

  /** 돌 하나를 추가해 오목을 만들 수 있는지 확인 */
  checkFour(four: IPositionTuple<4>) {
    const positions = this.sortPositions(four);

    if (this.hasWhite(positions)) return false;

    const [first, last] = [positions[0], positions[positions.length - 1]];
    const distance = OmokAnalyzer.getDistance(first, last);
    const direction = OmokAnalyzer.getDirection(first, last);
    const reverse = direction.reverse();

    // 붙은 4인 경우 유효한 4인지 확인
    if (distance === 3 && Positions.isSequential(positions)) {
      // 한 방향이라도 열려있는지 확인
      const [beforeFirst, afterLast] = [move(first, reverse), move(last, direction)];
      const isNextFirstOpen = this.board.canDropStone(beforeFirst);
      const isNextLastOpen = this.board.canDropStone(afterLast);
      const hasOpenSide = isNextFirstOpen || isNextLastOpen;

      if (!hasOpenSide) return false;

      // 한 방향만 열려 있는 경우 열려있는 방향에 돌이 있는지 확인, 돌을 놓을 수 있는 경우 조건 성립
      if (isNextFirstOpen && !isNextLastOpen) {
        const twoBeforeFirst = move(beforeFirst, reverse);

        return this.board.canDropStone(twoBeforeFirst);
      }

      if (isNextLastOpen && !isNextFirstOpen) {
        const twoAfterLast = move(afterLast, direction);

        return this.board.canDropStone(twoAfterLast);
      }

      return true;
    }

    // 띈 4인 경우 유효한 4인지 확인
    if (distance === 4 && Positions.isSequentialSkipOnce(positions)) {
      // 양 옆이 막혀있어도 괜찮음, 띈 자리에 착수할 수 있는지만 확인
      for (let i = 0; i < positions.length - 1; i += 1) {
        const moved = move(positions[i], direction);
        const next = positions[i + 1];

        if (!(moved.x === next.x && moved.y === next.y)) return this.board.canDropStone(moved);
      }
    }

    return false;
  }

  bothSideEmpty(positions: IPosition[]) {
    const [first, last] = [
      new Position(positions[0].x, positions[0].y),
      new Position(positions[positions.length - 1].x, positions[positions.length - 1].y),
    ];
    const direction = OmokAnalyzer.getDirection(first, last);
    const reverse = direction.reverse();

    return (
      this.board.canDropStone(move(first, reverse)) &&
      this.board.canDropStone(move(last, direction))
    );
  }

  private hasWhite(positions: IPosition[]) {
    return positions.some((position) => this.board.get(position)?.color === 'white');
  }

  private hasGapConnection(positions: IPosition[]) {
    const first = positions[0];
    const last = positions[positions.length - 1];
    const direction = OmokAnalyzer.getDirection(first, last);
    const reverse = direction.reverse();

    return (
      this.board.get(move(first, reverse, 2))?.color === 'black' ||
      this.board.get(move(last, direction, 2))?.color === 'black'
    );
  }

  private sortPositions<N extends IPosition[]>(positions: N): IPositionTuple<N['length']> {
    const position = new Positions(...positions);
    position.sort();

    return position.getAll();
  }

  /** position1 -> position2로 향하는 방향 */
  static getDirection(position1: IPosition, position2: IPosition) {
    const change = (n: number) => {
      if (n < 0) return 1;
      if (n > 0) return -1;
      return 0;
    };

    return new Direction(change(position1.x - position2.x), change(position1.y - position2.y));
  }

  /** 두 돌 간 거리를 반환 */
  static getDistance(position1: IPosition, position2: IPosition) {
    const distance = Math.abs(position1.x - position2.x || position1.y - position2.y);

    return distance;
  }
}

export default OmokAnalyzer;
