import Position, { IPosition, IPositionTuple, move } from '../entities/Position';
import Direction from '../entities/Direction';
import Stone, { StoneColor } from '../entities/Stone';
import PositionHelper from '../entities/PositionHelper';

/**
 * 오목판 클래스
 */
class Board {
  // 15*15, 배열 인덱싱 0 ~ 14
  static readonly SIZE = 14;

  static readonly EMPTY = null;

  private board: (Stone | typeof Board.EMPTY)[][];

  private stoneCount = 0;

  constructor() {
    this.board = Array.from({ length: Board.SIZE + 1 }, () =>
      new Array(Board.SIZE + 1).fill(Board.EMPTY),
    );
  }

  /** 해당하는 포지션의 요소(돌 또는 공백)를 반환 */
  get(position: IPosition) {
    if (!Board.isValidStonePosition(position)) return Board.EMPTY;

    const { x, y } = position;

    return this.board[x][y];
  }

  /** board의 상태 반환 */
  getBoard() {
    return this.board;
  }

  /** 놓여진 돌 갯수 반환 */
  getStoneCount() {
    return this.stoneCount;
  }

  /**
   * 보드에 돌을 착수하는 메서드
   */
  dropStone(position: IPosition, color: StoneColor) {
    const { x, y } = position;

    if (x < 0 || x > Board.SIZE || y < 0 || y > Board.SIZE) {
      throw new Error('올바르지 않은 착수 위치입니다');
    }

    if (this.board[x][y] !== Board.EMPTY) {
      throw new Error(`이미 돌이 놓여진 자리입니다`);
    }

    this.stoneCount += 1;
    this.board[x][y] = new Stone(color, x, y);
  }

  /** 보드에서 돌을 제거하는 메서드 */
  removeStone(position: IPosition) {
    const { x, y } = position;

    if (!Board.isValidStonePosition(position)) return;

    this.board[x][y] = Board.EMPTY;
    this.stoneCount -= 1;
  }

  /** 돌을 놓을 수 있는 위치인지 확인하는 함수 */
  canDropStone(position: IPosition) {
    const { x, y } = position;

    if (!Board.isValidStonePosition(position)) return false;

    return this.board[x][y] === Board.EMPTY;
  }

  /** 한 방향으로 돌 갯수 카운팅하는 함수 */
  countStones(
    position: IPosition,
    direction: Direction,
    target: StoneColor,
    options?: { skip?: number; assumeStonePlaced?: boolean },
  ): number {
    let count = 0;
    let skip = 0;
    const canSkip = options?.skip || 0;
    const { dx, dy } = direction;
    let { x, y } = position;
    const anotherStone = target === 'white' ? 'black' : 'white';

    if (options?.assumeStonePlaced) {
      count += 1;
      x += dx;
      y += dy;
    }

    while (Board.isValidStonePosition({ x, y })) {
      if (!Board.isValidStonePosition({ x, y })) break;
      const targetCell = this.board[x][y];

      if (targetCell?.color === target) count += 1;
      if (targetCell?.color === anotherStone) break;
      if (targetCell === Board.EMPTY) {
        if (skip === canSkip) break;
        skip += 1;
      }

      x += dx;
      y += dy;
    }

    return count;
  }

  /**
   * 양 방향으로 돌 갯수 카운팅
   * @param options.assumeStonePlaced 돌이 놓아져있다고 가정
   * @param options.skip skip 1회 허용
   */
  countStonesInBothDirections(
    position: IPosition,
    direction: Direction,
    target: StoneColor,
    options?: { assumeStonePlaced?: boolean; skip?: boolean },
  ): number {
    let total1 = 0;
    let total2 = 0;
    const { dx, dy } = direction;
    const reverse = Direction.reverse(direction);
    const rPosition = { x: position.x + reverse.dx, y: position.y + reverse.dy };

    total1 += this.countStones(position, new Direction(dx, dy), target, {
      assumeStonePlaced: options?.assumeStonePlaced,
      skip: options?.skip ? 1 : 0,
    });

    total1 += this.countStones(rPosition, reverse, target);

    total2 += this.countStones(position, new Direction(dx, dy), target, {
      assumeStonePlaced: options?.assumeStonePlaced,
    });

    total2 += this.countStones(rPosition, reverse, target, {
      skip: options?.skip ? 1 : 0,
    });

    // 양 방향으로 탐색한 이후 더 큰 수 반환
    return Math.max(total1, total2);
  }

  /**
   * position 포함해 n개 돌이 이어지는지 확인
   * @param options.strictMode n개의 돌이 정확하게 이어지는지 설정
   */
  isNConnected(
    position: IPosition,
    target: StoneColor,
    n: number,
    options?: { assumeStonePlaced?: boolean; strictMode?: boolean },
  ) {
    const halfDirections = Direction.getHalf();

    for (let i = 0; i < halfDirections.length; i += 1) {
      const direction = halfDirections[i];

      const count = this.countStonesInBothDirections(position, direction, target, {
        assumeStonePlaced: options?.assumeStonePlaced,
        skip: true,
      });

      if (options?.strictMode) if (count === n) return true;
      if (!options?.strictMode) if (count >= n) return true;
    }

    return false;
  }

  /**
   * position을 포함한 target의 연결된 2 또는 3개 위치 찾기
   * @param position 기준 위치
   * @param target 찾을 돌
   * @param count 찾을 돌 갯수
   * @param options.skip 허용할 스킵 횟수
   * @param options.positionIsEmpty position이 공백인지 여부, true인 경우 건너뛰고 탐색
   */
  findConnectedStones<T extends 2 | 3>(
    position: IPosition,
    target: StoneColor,
    count: T,
    options?: { skip?: number; positionIsEmpty?: boolean },
  ): IPositionTuple<T>[] {
    const result: IPositionTuple<T>[] = [];
    const cachedPositions = new Set();
    const otherStone: StoneColor = target === 'black' ? 'white' : 'black';
    const skip = options?.skip || 0;

    const positionToCacheData = (positions: IPosition[]) => {
      let data = '';

      for (let i = 0; i < positions.length; i += 1) {
        data += `-${positions[i].x}.${positions[i].y}`;
      }

      return data.slice(1);
    };

    const isPositionCached = (targetPositions: IPosition[]) =>
      cachedPositions.has(positionToCacheData(PositionHelper.sort(targetPositions)));

    const cachePosition = (targetPositions: IPosition[]) => {
      cachedPositions.add(positionToCacheData(PositionHelper.sort(targetPositions)));
    };

    // 연결된 돌 위치 찾기
    const findInDirection = (
      p: IPosition,
      d: Direction,
      reverse = false, // 역방향 탐색할지에 대한 reverse
    ): IPositionTuple<T> | undefined => {
      const positions: IPosition[] = [];
      const { dx, dy } = d;
      let { x: cx, y: cy } = p;
      let skipCount = 0;

      // 현재 포지션이 비어있는 경우 direction만큼 이동
      if (options?.positionIsEmpty) {
        cx += dx;
        cy += dy;
      }

      // reverse true인 경우 역방향 탐색
      if (reverse) {
        const { dx: rdx, dy: rdy } = Direction.reverse(d);
        let { x: rx, y: ry } = p;
        let reverseSkipCount = 0;

        while (Board.isValidStonePosition({ x: rx, y: ry })) {
          rx += rdx;
          ry += rdy;

          const currentCell = this.get({ x: rx, y: ry });

          if (currentCell?.color === otherStone) break;
          if (currentCell === Board.EMPTY) {
            if (reverseSkipCount === skip) break;

            reverseSkipCount += 1;
          }
          if (currentCell?.color === target) positions.push(new Position(rx, ry));
        }

        if (positions.length) {
          skipCount += reverseSkipCount - positions.length;
        }
      }
      while (Board.isValidStonePosition({ x: cx, y: cy })) {
        const currentPosition = new Position(cx, cy);

        if (!Board.isValidStonePosition(currentPosition)) break;

        const currentCell = this.get(currentPosition);

        if (currentCell?.color === otherStone) break;
        if (currentCell === Board.EMPTY) {
          if (skipCount === skip) break;
          skipCount += 1;
        }

        if (currentCell?.color === target) positions.push(currentPosition);

        cx += dx;
        cy += dy;

        // 캐싱된 경우 중복 처리 방지
        if (positions.length === count && !isPositionCached(positions)) {
          const nextCell = this.get(move(currentPosition, d));

          if (nextCell?.color === target) break;

          // 캐싱되지 않은 경우 캐싱하고 위치 반환
          cachePosition(positions);

          return positions as IPositionTuple<T>;
        }
      }

      return undefined;
    };

    const DIRECTIONS = Direction.getAll();

    for (let i = 0; i < DIRECTIONS.length; i += 1) {
      const foundPositions = findInDirection(position, DIRECTIONS[i]);

      if (foundPositions) result.push(foundPositions);
    }

    for (let i = 0; i < DIRECTIONS.length; i += 1) {
      const foundPositions = findInDirection(position, DIRECTIONS[i], true);

      if (foundPositions) result.push(foundPositions);
    }

    return result;
  }

  // 디버깅용 메서드
  view() {
    console.log(
      this.board
        .map((row, i) => {
          const result =
            `${i}`.padStart(2, ' ') +
            row
              .map((cell) => {
                if (cell?.color === 'black') return '⚫️';
                if (cell?.color === 'white') return '⚪️';
                return '🔵';
              })
              .join('');

          if (i === 0) {
            const numbers = Array.from({ length: Board.SIZE + 1 }, (_, id) =>
              `${id}`.padEnd(2, ' '),
            );

            return `  ${numbers.join('')}\n${result}`;
          }

          return result;
        })
        .join('\n'),
    );
  }

  /** 올바른 착수 위치(보드 내)인지 확인하는 함수 */
  static isValidStonePosition(position: IPosition) {
    const { x, y } = position;

    return x >= 0 && x <= Board.SIZE && y >= 0 && y <= Board.SIZE;
  }
}

export default Board;
