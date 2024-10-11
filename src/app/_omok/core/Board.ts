import { DIRECTIONS, HALF_DIRECTIONS } from '../constants';
import Position, { PositionTuple } from '../entities/Position';
import Direction from '../entities/Direction';
import Stone, { StoneColor } from '../entities/Stone';
import Positions from '../entities/Positions';

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
  get(position: Position) {
    const { x, y } = position;

    if (!Board.isValidStonePosition(position)) return Board.EMPTY;

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
  dropStone(position: Position, color: StoneColor) {
    const { x, y } = position;

    if (x < 0 || x > Board.SIZE || y < 0 || y > Board.SIZE) {
      throw new Error('올바르지 않은 착수 위치입니다');
    }

    if (this.board[x][y] !== Board.EMPTY) {
      throw new Error(`이미 돌이 놓여진 자리입니다`);
    }

    this.stoneCount += 1;
    this.board[x][y] = new Stone(color);
  }

  /** 돌을 놓을 수 있는 위치인지 확인하는 함수 */
  canDropStone(position: Position) {
    const { x, y } = position;

    if (!Board.isValidStonePosition(position)) return false;

    return this.board[x][y] === Board.EMPTY;
  }

  /** 한 방향으로 돌 갯수 카운팅하는 함수 */
  countStones(
    position: Position,
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

    while (skip <= canSkip) {
      if (!Board.isValidStonePosition(new Position(x, y))) break;

      const targetCell = this.board[x][y];

      if (targetCell?.color === anotherStone) break;
      if (targetCell === Board.EMPTY) skip += 1;
      if (targetCell?.color === target) count += 1;

      x += dx;
      y += dy;
    }

    return count;
  }

  /**
   * 양 방향으로 돌 갯수 카운팅
   * @param options.assumeStonePlaced 돌이 놓아져있다고 가정
   * @param options.skip skip 1회 허용
   * @returns
   */
  countStonesInBothDirections(
    position: Position,
    direction: Direction,
    target: StoneColor,
    options?: { assumeStonePlaced?: boolean; skip?: boolean },
  ): number {
    let total1 = 0;
    let total2 = 0;
    const { dx, dy } = direction;
    const reverse = direction.reverse();

    total1 += this.countStones(position, new Direction(dx, dy), target, {
      assumeStonePlaced: options?.assumeStonePlaced,
      skip: options?.skip ? 1 : 0,
    });
    total1 += this.countStones(position.move(reverse.dx, reverse.dy), direction.reverse(), target);

    total2 += this.countStones(position, new Direction(dx, dy), target, {
      assumeStonePlaced: options?.assumeStonePlaced,
    });

    total2 += this.countStones(position.move(reverse.dx, reverse.dy), direction.reverse(), target, {
      skip: options?.skip ? 1 : 0,
    });

    // 양 방향으로 탐색한 이후 더 큰 수 반환
    return Math.max(total1, total2);
  }

  /** position 포함해 n개의 돌이 이어지는지 확인 */
  isNConnected(
    position: Position,
    target: StoneColor,
    n: number,
    options?: { assumeStonePlaced?: boolean },
  ) {
    for (let i = 0; i < HALF_DIRECTIONS.length; i += 1) {
      const direction = HALF_DIRECTIONS[i];

      const count = this.countStonesInBothDirections(position, direction, target, {
        assumeStonePlaced: options?.assumeStonePlaced,
        skip: true,
      });

      if (count === n) return true;
    }

    return false;
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
    target: StoneColor,
    count: T,
    options?: { skip?: number; positionIsEmpty?: boolean },
  ): PositionTuple<T>[] {
    const result: PositionTuple<T>[] = [];
    const cachedPositions = new Set();
    const otherStone: StoneColor = target === 'black' ? 'white' : 'black';
    const maxSkip = options?.skip || 0;

    const positionToCacheData = (positions: Position[]) => {
      let data = '';

      for (let i = 0; i < positions.length; i += 1) {
        data += `-${positions[i].x}.${positions[i].y}`;
      }

      return data.slice(1);
    };

    const isPositionCached = (targetPositions: Position[]) => {
      const positions = new Positions(...targetPositions);
      positions.sort();

      return cachedPositions.has(positionToCacheData(positions.getAll()));
    };

    const cachePosition = (targetPositions: Position[]) => {
      const positions = new Positions(...targetPositions);
      positions.sort();
      cachedPositions.add(positionToCacheData(positions.getAll()));
    };

    // 연결된 돌 위치 찾기
    const find = (p: Position, d: Direction): PositionTuple<T> | undefined => {
      const positions: Position[] = [];
      const { dx, dy } = d;

      const reverse = d.reverse();
      const { dx: rdx, dy: rdy } = reverse;

      let { x: cx, y: cy } = p;
      let { x: rx, y: ry } = p.move(reverse.dx, reverse.dy);
      let skipCount = 0;

      // 역방향 카운팅
      while (Board.isValidStonePosition(new Position(rx, ry))) {
        if (!Board.isValidStonePosition(new Position(rx, ry))) break;

        const currentPosition = new Position(rx, ry);
        const currentCell = this.board[rx][ry];

        if (currentCell?.color === otherStone || currentCell === Board.EMPTY) break;
        if (currentCell?.color === target) positions.push(currentPosition);

        rx += rdx;
        ry += rdy;
      }

      while (Board.isValidStonePosition(new Position(cx, cy))) {
        if (!Board.isValidStonePosition(new Position(cx, cy))) break;

        const currentPosition = new Position(cx, cy);
        const currentCell = this.get(currentPosition);

        if (currentCell?.color === otherStone) break;
        if (currentCell?.color === target) positions.push(currentPosition);
        if (currentCell === Board.EMPTY) {
          if (skipCount > maxSkip) break;
          if (!options?.positionIsEmpty) skipCount += 1;
          if (options?.positionIsEmpty && !p.isSame(currentPosition)) {
            skipCount += 1;
          }
        }

        // 캐싱된 경우 중복 처리 방지
        if (positions.length === count && !isPositionCached(positions)) {
          const nextCell = this.get(currentPosition.move(dx, dy));

          if (nextCell?.color === target) break;

          // 캐싱되지 않은 경우 캐싱하고 위치 반환
          cachePosition(positions);

          return positions as PositionTuple<T>;
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
  static isValidStonePosition(position: Position) {
    const { x, y } = position;

    return x >= 0 && x <= Board.SIZE && y >= 0 && y <= Board.SIZE;
  }
}

export default Board;
