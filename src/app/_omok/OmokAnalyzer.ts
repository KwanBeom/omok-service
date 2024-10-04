import Board from './Board';
import { STONE } from './Stone';
import { createDirection, createPosition, Position, Positions, sortPositions } from './utils';

/** 오목 분석 클래스 */
class OmokAnalyzer {
  /** 돌들이 나란히 이어져 있는지 확인 */
  static isSequential(stones: Position[]) {
    // const stones = [...stones];
    const { dx, dy } = this.getDirection(stones[0], stones[stones.length - 1]);

    for (let i = 0; i < stones.length - 1; i += 1) {
      const current = stones[i];
      const next = stones[i + 1];

      if (!(current.x + dx === next.x && current.y + dy === next.y)) {
        return false;
      }
    }

    return true;
  }

  /** 1칸 스킵 허용하고 돌들이 나란히 이어져 있는지 확인 */
  static isSequentialSkipOnce(stones: Position[]) {
    let { x, y } = stones[0];
    let skip = false;
    const { dx, dy } = this.getDirection(stones[0], stones[stones.length - 1]);

    for (let i = 0; i < stones.length - 1; i += 1) {
      const next = stones[i + 1];

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

    return createDirection(change(stone1.x - stone2.x), change(stone1.y - stone2.y));
  }

  /** 두 돌 간 거리를 반환 */
  static getDistance(position1: Position, position2: Position) {
    const distance = Math.abs(position1.x - position2.x || position1.y - position2.y);

    return distance;
  }

  /** open two인지 확인 */
  static checkOpenTwo(board: Board, stones: Positions<2>) {
    const [position1, position2] = stones;
    const { dx, dy } = this.getDirection(position1, position2);
    const distance = this.getDistance(position1, position2);

    const bothSideEmpty =
      board.canDropStone(createPosition(position1.x + -dx, position1.y + -dy)) &&
      board.canDropStone(createPosition(position2.x + dx, position2.y + dy));

    if (!bothSideEmpty) return false;

    if (distance === 1) return true;

    const innerFirstPosition = createPosition(position1.x + dx, position1.y + dy);

    if (distance === 2) return board.canDropStone(innerFirstPosition);

    const innerSecondPosition = createPosition(position1.x + dx * 2, position1.y + dy * 2);

    if (distance === 3) {
      return board.canDropStone(innerFirstPosition) && board.canDropStone(innerSecondPosition);
    }

    return false;
  }

  /** open three인지 확인 */
  static checkOpenThree(board: Board, stones: Positions<3>) {
    const isHaveWhite = stones.some((position) => board.get(position) === STONE.WHITE.POINT);

    if (isHaveWhite) return false;

    const sortedPositions = sortPositions(stones);
    const fisrtPosition = sortedPositions[0];
    const lastPosition = sortedPositions[sortedPositions.length - 1];
    // stones[0]에서 stones[2]으로 향하는 방향
    const { dx, dy } = this.getDirection(fisrtPosition, lastPosition);
    const bothSideEmpty =
      board.canDropStone(createPosition(fisrtPosition.x + -dx, fisrtPosition.y + -dy)) &&
      board.canDropStone(createPosition(lastPosition.x + dx, lastPosition.y + dy));

    if (!bothSideEmpty) return false;

    // 띈 위치에 흑돌이 있는지 확인, 있는 경우 띈 4 조건 성립이기 때문에 false
    const isHaveConnectedStone =
      board.get(createPosition(fisrtPosition.x + -dx * 2, fisrtPosition.y + -dy * 2)) ===
        STONE.BLACK.POINT ||
      board.get(createPosition(lastPosition.x + dx * 2, lastPosition.y + dy * 2)) ===
        STONE.BLACK.POINT;

    if (isHaveConnectedStone) return false;

    const distance = this.getDistance(fisrtPosition, lastPosition);

    // 붙은 3
    if (distance === 2) return this.isSequential(sortedPositions);
    // 띈 3
    if (distance === 3) return this.isSequentialSkipOnce(sortedPositions);

    return false;
  }

  /** open four인지 확인 */
  static checkOpenFour(board: Board, stones: Positions<4>) {
    const isHaveWhite = stones.some((position) => board.get(position) === STONE.WHITE.POINT);

    if (isHaveWhite) return false;

    const sortedPositions = sortPositions(stones);
    const fisrtPosition = sortedPositions[0];
    const lastPosition = sortedPositions[sortedPositions.length - 1];
    const { dx, dy } = this.getDirection(fisrtPosition, lastPosition);

    const bothSideEmpty =
      board.canDropStone(createPosition(fisrtPosition.x + -dx, fisrtPosition.y + -dy)) &&
      board.canDropStone(createPosition(lastPosition.x + dx, lastPosition.y + dy));

    if (!bothSideEmpty) return false;

    // 띈 위치에 흑돌이 있는지 확인, 있는 경우 6목이 되기 때문에 false
    const isHaveConnectedStone =
      board.get(createPosition(fisrtPosition.x + -dx * 2, fisrtPosition.y + -dy * 2)) ===
        STONE.BLACK.POINT ||
      board.get(createPosition(lastPosition.x + dx * 2, lastPosition.y + dy * 2)) ===
        STONE.BLACK.POINT;

    if (isHaveConnectedStone) return false;

    const distance = this.getDistance(fisrtPosition, lastPosition);
    // 붙은 4
    if (distance === 3) return this.isSequential(sortedPositions);
    // 띈 4
    if (distance === 4) return this.isSequentialSkipOnce(sortedPositions);

    return false;
  }

  /** 돌 하나를 추가해 오목을 만들 수 있는지 확인 */
  static checkFour(board: Board, stones: Positions<4>) {
    const isHaveWhite = stones.some((position) => board.get(position) === STONE.WHITE.POINT);

    if (isHaveWhite) return false;

    const sortedStones = sortPositions(stones);
    const fisrtPosition = sortedStones[0];
    const lastPosition = sortedStones[sortedStones.length - 1];
    const distance = this.getDistance(fisrtPosition, lastPosition);
    const { dx, dy } = this.getDirection(fisrtPosition, lastPosition);

    // 붙은 4인 경우 유효한 4인지 확인
    if (distance === 3 && OmokAnalyzer.isSequential(sortedStones)) {
      // 한 방향이라도 열려있는지 확인해야 함
      const nextFirst = createPosition(fisrtPosition.x + -dx, fisrtPosition.y + -dy);
      const nextLast = createPosition(lastPosition.x + dx, lastPosition.y + dy);
      const isNextFirstOpen = board.canDropStone(nextFirst);
      const isNextLastOpen = board.canDropStone(nextLast);
      const hasOpenSide = isNextFirstOpen || isNextLastOpen;

      if (!hasOpenSide) return false;

      // 한 방향만 열려 있는 경우 열려있는 방향에 돌이 있는지 확인, 돌을 놓을 수 있는 경우 조건 성립
      if (isNextFirstOpen && !isNextLastOpen) {
        return board.canDropStone(createPosition(nextFirst.x + -dx, nextFirst.y + -dy));
      }

      if (isNextLastOpen && !isNextFirstOpen) {
        return board.canDropStone(createPosition(nextLast.x + dx, nextLast.y + dy));
      }

      return true;
    }

    // 띈 4인 경우 유효한 4인지 확인
    if (distance === 4 && OmokAnalyzer.isSequentialSkipOnce(sortedStones)) {
      // 양 옆이 막혀있어도 괜찮음, 띈 자리에 착수할 수 있는지만 확인
      for (let i = 0; i < stones.length - 1; i += 1) {
        const sum = createPosition(stones[i].x + dx, stones[i].y + dy);

        if (!(sum.x === stones[i + 1].x && sum.y === stones[i + 1].y)) {
          return board.canDropStone(sum);
        }
      }
    }

    return false;
  }
}

export default OmokAnalyzer;
