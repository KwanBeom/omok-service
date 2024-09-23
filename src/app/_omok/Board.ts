import { STONE, StonePoint } from './Stone';
import { createDirection, Direction, Position } from './utils';

export const EMPTY = 0 as const;

// 15*15, 배열 인덱싱 0 ~ 14
export const BOARD_SIZE = 14;

/**
 * 오목판 클래스
 */
class Board {
  private board: (StonePoint | typeof EMPTY)[][];

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

  /** 돌들이 나란히 이어져 있는지 확인 */
  static isSequential(stones: Position[]) {
    const positions = [...stones];
    const { dx, dy } = Board.getDirection(positions[0], positions[positions.length - 1]);

    for (let i = 0; i < positions.length - 1; i += 1) {
      const current = positions[i];
      const next = positions[i + 1];

      if (!(current.x + dx === next.x && current.y + dy === next.y)) {
        return false;
      }
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

  /** 올바른 착수 위치(보드 내)인지 확인하는 함수 */
  static isValidStonePosition(position: Position) {
    return (
      position.x >= 0 && position.x <= BOARD_SIZE && position.y >= 0 && position.y <= BOARD_SIZE
    );
  }
}

export default Board;
