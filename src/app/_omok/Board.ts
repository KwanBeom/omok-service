import { DIRECTIONS } from './constants';
import { STONE, StonePoint } from './Stone';
import {
  createDirection,
  createPosition,
  Direction,
  isSamePosition,
  Position,
  Positions,
  sortPositions,
} from './utils';

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
    const { x, y } = position;

    if (x < 0 || x > BOARD_SIZE || y < 0 || y > BOARD_SIZE) {
      throw new Error('올바르지 않은 착수 위치입니다');
    }

    if (this.board[x][y] !== EMPTY) {
      throw new Error('이미 돌이 놓여진 자리입니다');
    }

    this.stoneCount += 1;
    this.board[x][y] = stone;
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
  countStones(
    position: Position,
    direction: Direction,
    target: StonePoint,
    options?: { bothDirection?: boolean },
  ): number {
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
    options: { assumeStonePlaced?: boolean } = {},
  ): number {
    let total = 0;
    const { dx, dy } = direction;

    // 정방향 돌 세기
    total += this.countStones(
      options?.assumeStonePlaced ? createPosition(position.x + dx, position.y + dy) : position,
      createDirection(dx, dy),
      target,
    );

    // 반대 방향 돌 세기
    total += this.countStones(
      options?.assumeStonePlaced ? createPosition(position.x + -dx, position.y + -dy) : position,
      createDirection(-dx, -dy),
      target,
    );

    // assumeStonePlace 옵션이 활성화 되지 않은 경우 시작 위치가 2번 카운팅 되기 때문에 -1
    return options?.assumeStonePlaced ? total : total - 1;
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
        const isNextPositionValid = Board.isValidStonePosition(createPosition(x + dx, y + dy));
        const nextIsWhiteStone =
          isNextPositionValid && this.board[x + dx][y + dy] === STONE.WHITE.POINT;

        if (nextIsWhiteStone) break;

        // 한번만 점프 가능한 경우
        if (canSkip - skipPositions.length === 1) {
          // 점프 가능한 조건인 경우 점프하고 다음 반복문으로
          if (isNextPositionValid && this.board[x + dx][y + dy] === STONE.BLACK.POINT) {
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

  /**
   * position을 포함한 target의 연결된 count개 위치 찾기
   * @param position 기준 위치
   * @param target 찾을 돌
   * @param count 찾을 돌 갯수
   * @param options.skip 허용할 스킵 횟수
   * @param options.positionIsEmpty position이 공백인지 여부, true인 경우 건너뛰고 탐색
   */
  findConnectedStones<T extends number>(
    position: Position,
    target: StonePoint,
    count: T,
    options?: { skip?: number; positionIsEmpty?: boolean },
  ): Positions<T>[] {
    const result: Positions<T>[] = [];
    const cachedPositions = new Set();
    const otherStone = target === STONE.BLACK.POINT ? STONE.WHITE.POINT : STONE.BLACK.POINT;
    const maxSkip = options?.skip || 0;

    const positionToCacheData = (positions: Position[]) => {
      let data = '';

      for (let i = 0; i < positions.length; i += 1) {
        data += `-${positions[i].x}.${positions[i].y}`;
      }

      return data.slice(1);
    };

    const isPositionCached = (positions: Position[]) => {
      const sortedPositions = sortPositions(positions);

      return cachedPositions.has(positionToCacheData(sortedPositions));
    };

    const cachePosition = (positions: Position[]) => {
      const sortedPositions = sortPositions(positions);

      cachedPositions.add(positionToCacheData(sortedPositions));
    };

    // 연결된 돌 위치 찾기
    const find = (p: Position, d: Direction): Positions<T> | undefined => {
      const positions: Position[] = [];
      const { dx, dy } = d;
      let { x: cx, y: cy } = p;
      let { x: rx, y: ry } = createPosition(cx + -dx, cy + -dy);
      let skipCount = 0;

      // 역방향 카운팅
      while (Board.isValidStonePosition(createPosition(rx, ry))) {
        const currentPosition = createPosition(rx, ry);
        const currentCell = this.get(currentPosition);

        if (currentCell === otherStone || currentCell === EMPTY) break;
        if (currentCell === target) positions.push(currentPosition);

        rx += -dx;
        ry += -dy;
      }

      while (Board.isValidStonePosition(createPosition(cx, cy))) {
        const currentPosition = createPosition(cx, cy);
        const currentCell = this.get(currentPosition);

        if (currentCell === otherStone) break;
        if (currentCell === target) positions.push(currentPosition);
        if (currentCell === EMPTY) {
          if (skipCount > maxSkip) break;
          if (!options?.positionIsEmpty) skipCount += 1;
          if (options?.positionIsEmpty && !isSamePosition(p, currentPosition)) {
            skipCount += 1;
          }
        }

        // 캐싱된 경우 중복 처리 방지
        if (positions.length === count && !isPositionCached(positions)) {
          const nextCell = this.get(createPosition(cx + dx, cy + dy));
          if (nextCell === target) break;

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
      const foundPositions = find(position, DIRECTIONS[i]);

      if (foundPositions) result.push(foundPositions);
    }

    return result;
  }

  // TODO: 디버깅용 삭제 필요
  view() {
    console.log(
      this.board
        .map((row) =>
          row
            .map((cell) => {
              if (cell === STONE.BLACK.POINT) return '⚫️';
              if (cell === STONE.WHITE.POINT) return '⚪️';
              return '⭕️';
            })
            .join(''),
        )
        .join('\n'),
    );
  }

  /** 올바른 착수 위치(보드 내)인지 확인하는 함수 */
  static isValidStonePosition(position: Position) {
    return (
      position.x >= 0 && position.x <= BOARD_SIZE && position.y >= 0 && position.y <= BOARD_SIZE
    );
  }
}

export default Board;
