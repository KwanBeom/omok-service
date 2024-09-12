import { BOARD_SIZE } from './Board';
import { StoneColor, StonePoint } from './Stone';
import { Position, StoneBoard } from './types';

/**
 * Stone이 들어가 있는 Board를 Stone의 getPoint 함수 활용 Point로 변환
 * @param board Stone의 인스턴스가 들어가있는 Board 클래스 인스턴스
 * @returns Stone의 Point로 변환된 Board
 */
export function changeStoneToPoint(board: StoneBoard) {
  return board.map((row) => row.map((stone) => stone?.getPoint() ?? 0));
}

/** 올바른 착수 위치(보드 내)인지 확인하는 함수 */
export function isValidStonePosition(position: Position) {
  return (
    position[0] >= 0 &&
    position[0] <= BOARD_SIZE &&
    position[1] >= 0 &&
    position[1] <= BOARD_SIZE
  );
}

/** 한 방향으로 돌 갯수 세는 함수 */
export function countStones(
  board: StoneBoard,
  position: Position,
  direction: Position,
  target: StonePoint,
): number {
  let count = 0;
  let [x, y] = position;

  while (isValidStonePosition([x, y]) && board[x][y]?.getPoint() === target) {
    count += 1;

    x += direction[0];
    y += direction[1];
  }

  return count;
}

/** 양 방향으로 돌 갯수 세는 함수 */
export function countStonesInBothDirections(
  board: StoneBoard,
  position: Position,
  direction: Position,
  target: StonePoint,
): number {
  let total = 0;
  const [dx, dy] = direction;

  // 정방향 돌 세기
  total += countStones(board, position, [dx, dy], target);
  // 반대 방향 돌 세기
  total += countStones(board, position, [-dx, -dy], target);

  // countStones 함수가 1부터 카운팅하기 때문에 -1
  return total - 1;
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

/** 진행된 수로 현재 누구의 턴인지 반환 */
export function getStoneColor(count: number): StoneColor {
  return count % 2 === 1 ? 'black' : 'white';
}
