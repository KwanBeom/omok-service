import { BOARD_SIZE } from './Board';
import { StonePoint } from './Stone';
import { Position, StoneBoard } from './types';

/**
 * Stone이 들어가 있는 Board를 Stone의 getPoint 함수 활용 Point로 변환
 * @param board Stone의 인스턴스가 들어가있는 Board 클래스 인스턴스
 * @returns Stone의 Point로 변환된 Board
 */
export function changeStoneToPoint(board: StoneBoard) {
  return board.map((row) => row.map((stone) => stone?.getPoint ?? 0));
}

/** 올바른 착수 위치(보드 내)인지 확인하는 함수 */
export function isValidStonePosition(position: Position) {
  const [row, col] = position;

  return row >= 0 && row <= BOARD_SIZE && col >= 0 && col <= BOARD_SIZE;
}

/** 돌 갯수 세는 함수 */
export function countStones(
  board: StoneBoard,
  position: Position,
  direction: Position,
  target: StonePoint,
) {
  const check = (p: Position, d: Position, count: number): number => {
    if (board[p[0]][p[1]]?.getPoint() !== target) {
      return count;
    }

    const [nx, ny] = [p[0] + d[0], p[1] + d[1]];

    if (!isValidStonePosition([nx, ny])) {
      return count;
    }

    return check([nx, ny], d, count + 1);
  };

  return check(position, direction, 0);
}

// TODO: 디버깅 메소드, 삭제 필요
export function view(board: StoneBoard) {
  console.log(
    board
      .map((row) =>
        row
          .map((stone) => {
            const point = stone?.getPoint() || stone;
            if (point === 1) return '⚫️';
            if (point === 2) return '⚪️';
            return '⭕️';
          })
          .join(''),
      )
      .join('\n'),
  );
}
