import { DIRECTIONS } from './constants';
import { STONE, StonePoint } from './Stone';
import { createDirection, createPosition, Direction, Position, Positions } from './utils';

export const EMPTY = 0 as const;

// 15*15, 배열 인덱싱 0 ~ 14
export const BOARD_SIZE = 14;

/**
 * 오목판 클래스
 */
class Board {
  private board: (StonePoint | typeof EMPTY)[][];

  private stoneCount = 0;

  constructor() {
    this.board = Array.from({ length: BOARD_SIZE + 1 }, () =>
      new Array(BOARD_SIZE + 1).fill(EMPTY),
    );
  }

  /** 해당하는 포지션의 요소(돌 또는 공백)를 반환 */
  get(position: Position) {
    const { x, y } = position;

    if (!Board.isValidStonePosition(position)) return EMPTY;

    return this.board[x][y];
  }

  /** 놓여진 돌 갯수 반환 */
  getStoneCount() {
    return this.stoneCount;
  }

  /**
   * 보드에 돌을 착수하는 메서드
   * @param row 열
   * @param col 행
   * @param stone 놓아질 돌
   */
  dropStone(position: Position, stone: StonePoint) {
    const { x: row, y: col } = position;

    if (row < 0 || row > BOARD_SIZE || col < 0 || col > BOARD_SIZE) {
      throw new Error('올바르지 않은 착수 위치입니다');
    }

    if (this.board[row][col] !== EMPTY) {
      throw new Error('이미 돌이 놓여진 자리입니다');
    }

    this.stoneCount += 1;
    this.board[row][col] = stone;
  }

  /** 돌을 놓을 수 있는 위치인지 확인하는 함수 */
  canDropStone(position: Position) {
    const { x, y } = position;
    const isInsideBoard =
      position.x >= 0 && position.x <= BOARD_SIZE && position.y >= 0 && position.y <= BOARD_SIZE;

    if (!isInsideBoard) {
      return false;
    }

    return this.board[x][y] === EMPTY;
  }

  /** 한 방향으로 돌 갯수 세는 함수 */
  countStones(position: Position, direction: Direction, target: StonePoint): number {
    let count = 0;
    let { x, y } = position;
    const { dx, dy } = direction;

    while (Board.isValidStonePosition({ x, y }) && this.board[x][y] === target) {
      count += 1;

      x += dx;
      y += dy;
    }

    return count;
  }

  /** 양 방향으로 돌 갯수 세는 함수 */
  countStonesInBothDirections(
    position: Position,
    direction: Direction,
    target: StonePoint,
  ): number {
    let total = 0;
    const { dx, dy } = direction;

    // 정방향 돌 세기
    total += this.countStones(position, createDirection(dx, dy), target);
    // 반대 방향 돌 세기
    total += this.countStones(position, createDirection(-dx, -dy), target);

    // countStones 함수가 1부터 카운팅해서 토탈 - 1
    return total - 1;
  }

  /** 빈 셀은 건너뛰고 돌 갯수 세는 함수 */
  countStonesSkippingEmpty(
    position: Position,
    direction: Direction,
    target: StonePoint,
    canSkip: number,
  ): { count: number; skipPositions: Position[] } {
    let { x, y } = position;
    const { dx, dy } = direction;
    const skipPositions: Position[] = [];
    let count = 0;

    while (
      Board.isValidStonePosition({ x, y }) &&
      (this.board[x][y] === target || canSkip - skipPositions.length > 0)
    ) {
      if (this.board[x][y] === target) count += 1;

      if (this.board[x][y] === EMPTY) {
        const isNextPosValid = Board.isValidStonePosition({ x: x + dx, y: y + dy });
        const isNextWhiteStone = isNextPosValid && this.board[x + dx][y + dy] === STONE.WHITE.POINT;

        if (isNextWhiteStone) break;

        // 한번만 점프 가능한 경우
        if (canSkip - skipPositions.length === 1) {
          if (isNextPosValid && this.board[x + dx][y + dy] === STONE.BLACK.POINT) {
            skipPositions.push({ x, y });
          } else {
            break;
          }
        }
      }

      x += dx;
      y += dy;
    }

    // 건너뛴 위치도 함께 반환
    return { count, skipPositions };
  }

  /** position 기준, 연결되어 있는 count개 돌 위치 찾기 */
  findConnectedStones<T extends number>(position: Position, count: T): Positions<T>[] {
    const result: Positions<T>[] = [];
    const cachedPositions = new Set();

    const positionToCacheData = (positions: Position[]) => {
      let data = '';

      for (let i = 0; i < positions.length; i += 1) {
        data += `-${positions[i].x}.${positions[i].y}`;
      }

      return data.slice(1);
    };

    const isPositionCached = (positions: Position[]) =>
      cachedPositions.has(positionToCacheData(positions));

    const cachePosition = (positions: Position[]) => {
      // 정/역방향 위치 캐싱
      cachedPositions.add(positionToCacheData(positions));
      cachedPositions.add(positionToCacheData([...positions].reverse()));
    };

    // 흑돌 연결된 돌들 위치 찾기
    const find = (p: Position, d: Direction): Positions<T> | undefined => {
      let { x: cx, y: cy } = p;
      const { dx, dy } = d;
      // 연결된 2 찾는 경우 OVVO 위해 skip 2회까지 허용
      const MAX_SKIP = count === 2 ? 2 : 1;
      let skipCount = 0;
      const positions: Position[] = [];
      const opossiteFirstPosition = createPosition(cx + -dx, cy + -dy);

      // 반대 방향의 첫번째 돌이 흑돌인 경우 카운팅
      if (
        Board.isValidStonePosition(opossiteFirstPosition) &&
        this.get(opossiteFirstPosition) === STONE.BLACK.POINT
      ) {
        positions.push(opossiteFirstPosition);
      }

      while (Board.isValidStonePosition(createPosition(cx, cy))) {
        const currentPosition = createPosition(cx, cy);
        const target = this.get(currentPosition);

        // 종료 조건
        if (target === STONE.WHITE.POINT) break;
        // 2회 스킵 허용
        if (target === EMPTY && skipCount >= MAX_SKIP) break;
        if (target === EMPTY) skipCount += 1;
        if (target === STONE.BLACK.POINT) positions.push(currentPosition);

        // 캐싱된 경우 중복 처리 방지
        if (positions.length === count && !isPositionCached(positions)) {
          // 캐싱되지 않은 경우 캐싱하고 위치 반환
          cachePosition(positions);

          return positions as Positions<T>;
        }

        cx += dx;
        cy += dy;
      }

      return undefined;
    };

    for (let i = 0; i < DIRECTIONS.length; i += 1) {
      const twoPosition = find(position, DIRECTIONS[i]);

      if (twoPosition) result.push(twoPosition);
    }

    return result;
  }

  /** 올바른 착수 위치(보드 내)인지 확인하는 함수 */
  static isValidStonePosition(position: Position) {
    return (
      position.x >= 0 && position.x <= BOARD_SIZE && position.y >= 0 && position.y <= BOARD_SIZE
    );
  }
}

export default Board;
