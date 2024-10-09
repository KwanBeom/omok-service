import Board from './Board';
import Direction from '../entities/Direction';
import Position, { Positions, sortPositions } from '../entities/Position';

/** 오목 분석 클래스 */
class OmokAnalyzer {
  /** 돌들이 나란히 이어져 있는지 확인 */
  static isSequential(positions: Position[]) {
    const { dx, dy } = this.getDirection(positions[0], positions[positions.length - 1]);

    for (let i = 0; i < positions.length - 1; i += 1) {
      const moved = positions[i].move(dx, dy);
      const next = positions[i + 1];

      if (!(moved.x === next.x && moved.y === next.y)) {
        return false;
      }
    }

    return true;
  }

  /** 1칸 스킵 허용하고 돌들이 나란히 이어져 있는지 확인 */
  static isSequentialSkipOnce(positions: Position[]) {
    let { x, y } = positions[0];
    let skip = false;
    const { dx, dy } = this.getDirection(positions[0], positions[positions.length - 1]);

    for (let i = 0; i < positions.length - 1; i += 1) {
      const next = positions[i + 1];

      if (!(x + dx === next.x && y + dy === next.y)) {
        if (skip) return false;

        skip = true;
        x += dx;
        y += dy;
      }

      x += dx;
      y += dy;
    }

    return true;
  }

  /** stone1에서 stone2로 향하는 방향 구하기 */
  static getDirection(stone1: Position, stone2: Position) {
    const change = (n: number) => {
      if (n < 0) return 1;
      if (n > 0) return -1;
      return 0;
    };

    return new Direction(change(stone1.x - stone2.x), change(stone1.y - stone2.y));
  }

  /** 두 돌 간 거리를 반환 */
  static getDistance(position1: Position, position2: Position) {
    const distance = Math.abs(position1.x - position2.x || position1.y - position2.y);

    return distance;
  }

  /** 나란히 위치한 포지션에서 띈 위치 반환 */
  static getSkippedPosition(positions: Position[]) {
    const sortedPositions = sortPositions(positions);
    const { dx, dy } = this.getDirection(
      sortedPositions[0],
      sortedPositions[sortedPositions.length - 1],
    );
    let { x, y } = sortedPositions[0];
    const result = [];

    for (let i = 0; i < sortedPositions.length; i += 1) {
      if (!(sortedPositions[i].x === x && sortedPositions[i].y === y)) {
        result.push(new Position(x, y));
        x += dx;
        y += dy;
      }

      x += dx;
      y += dy;
    }

    return result;
  }

  /** open two인지 확인 */
  static checkOpenTwo(board: Board, positions: Positions<2>) {
    const [position1, position2] = positions;
    const distance = this.getDistance(position1, position2);
    const direction = this.getDirection(position1, position2);
    const reverse = direction.reverse();

    const bothSideEmpty =
      board.canDropStone(position1.move(reverse.dx, reverse.dy)) &&
      board.canDropStone(position2.move(direction.dx, direction.dy));

    if (!bothSideEmpty) return false;

    if (distance === 1) return true;

    const innerFirstPosition = position1.move(direction.dx, direction.dy);

    if (distance === 2) return board.canDropStone(innerFirstPosition);

    const innerSecondPosition = position1.move(direction.dx, direction.dy, 2);

    if (distance === 3) {
      return board.canDropStone(innerFirstPosition) && board.canDropStone(innerSecondPosition);
    }

    return false;
  }

  /** open three인지 확인 */
  static checkOpenThree(board: Board, positions: Positions<3>) {
    const isHaveWhite = positions.some((position) => board.get(position)?.color === 'white');

    if (isHaveWhite) return false;

    const sortedPositions = sortPositions(positions);
    const first = sortedPositions[0];
    const last = sortedPositions[sortedPositions.length - 1];
    const direction = this.getDirection(first, last);
    const reverse = direction.reverse();

    const bothSideEmpty =
      board.canDropStone(first.move(reverse.dx, reverse.dy)) &&
      board.canDropStone(last.move(direction.dx, direction.dy));

    if (!bothSideEmpty) return false;

    // 띈 위치에 흑돌이 있는지 확인, 있는 경우 띈 4 조건 성립이기 때문에 false
    const isHaveConnectedStone =
      board.get(first.move(reverse.dx, reverse.dy, 2))?.color === 'black' ||
      board.get(last.move(direction.dx, direction.dy, 2))?.color === 'black';

    if (isHaveConnectedStone) return false;

    const distance = this.getDistance(first, last);

    // 붙은 3
    if (distance === 2) return this.isSequential(sortedPositions);
    // 띈 3
    if (distance === 3) return this.isSequentialSkipOnce(sortedPositions);

    return false;
  }

  /** open four인지 확인 */
  static checkOpenFour(board: Board, positions: Positions<4>) {
    const isHaveWhite = positions.some((position) => board.get(position)?.color === 'white');

    if (isHaveWhite) return false;

    const sortedPositions = sortPositions(positions);
    const first = sortedPositions[0];
    const last = sortedPositions[sortedPositions.length - 1];
    const direction = this.getDirection(first, last);
    const reverse = direction.reverse();

    const bothSideEmpty =
      board.canDropStone(first.move(reverse.dx, reverse.dy)) &&
      board.canDropStone(last.move(direction.dx, direction.dy));

    if (!bothSideEmpty) return false;

    // 띈 위치에 흑돌이 있는지 확인, 있는 경우 6목이 되기 때문에 false
    const isHaveConnectedStone =
      board.get(first.move(reverse.dx, reverse.dy, 2))?.color === 'black' ||
      board.get(last.move(direction.dx, direction.dy))?.color === 'black';

    if (isHaveConnectedStone) return false;

    const distance = this.getDistance(first, last);
    // 붙은 4
    if (distance === 3) return this.isSequential(sortedPositions);
    // 띈 4
    if (distance === 4) return this.isSequentialSkipOnce(sortedPositions);

    return false;
  }

  /** 돌 하나를 추가해 오목을 만들 수 있는지 확인 */
  static checkFour(board: Board, positions: Positions<4>) {
    const isHaveWhite = positions.some((position) => board.get(position)?.color === 'white');

    if (isHaveWhite) return false;

    const sortedStones = sortPositions(positions);
    const first = sortedStones[0];
    const last = sortedStones[sortedStones.length - 1];
    const distance = this.getDistance(first, last);
    const direction = this.getDirection(first, last);
    const reverse = direction.reverse();
    const { dx, dy } = direction;

    // 붙은 4인 경우 유효한 4인지 확인
    if (distance === 3 && OmokAnalyzer.isSequential(sortedStones)) {
      // 한 방향이라도 열려있는지 확인해야 함
      const nextFirst = first.move(reverse.dx, reverse.dy);
      const nextLast = last.move(direction.dx, direction.dy);
      const isNextFirstOpen = board.canDropStone(nextFirst);
      const isNextLastOpen = board.canDropStone(nextLast);
      const hasOpenSide = isNextFirstOpen || isNextLastOpen;

      if (!hasOpenSide) return false;

      // 한 방향만 열려 있는 경우 열려있는 방향에 돌이 있는지 확인, 돌을 놓을 수 있는 경우 조건 성립
      if (isNextFirstOpen && !isNextLastOpen) {
        return board.canDropStone(nextFirst.move(reverse.dx, reverse.dy));
      }

      if (isNextLastOpen && !isNextFirstOpen) {
        return board.canDropStone(nextLast.move(direction.dx, direction.dy));
      }

      return true;
    }

    // 띈 4인 경우 유효한 4인지 확인
    if (distance === 4 && OmokAnalyzer.isSequentialSkipOnce(sortedStones)) {
      // 양 옆이 막혀있어도 괜찮음, 띈 자리에 착수할 수 있는지만 확인
      for (let i = 0; i < positions.length - 1; i += 1) {
        const moved = positions[i].move(dx, dy);
        const next = positions[i + 1];

        if (!(moved.x === next.x && moved.y === next.y)) {
          return board.canDropStone(moved);
        }
      }
    }

    return false;
  }
}

export default OmokAnalyzer;
