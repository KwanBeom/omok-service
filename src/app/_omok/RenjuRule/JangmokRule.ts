import Board, { EMPTY } from '../Board';
import { createDirection, createPosition, Direction, Position } from '../utils';
import { STONE } from '../Stone';
import { DIRECTIONS } from '../constants';

class JangmokRule {
  private board: Board = new Board();

  private geumsu: Position[] = [];

  apply(board: Board, position: Position) {
    this.board = board;
    const { x, y } = position;

    for (let i = 0; i < DIRECTIONS.length; i += 1) {
      const { dx, dy } = DIRECTIONS[i];

      // 반대 방향 돌 카운팅
      const reverseDirectionStones = this.board.countStones(
        createPosition(x + -dx, y + -dy),
        createDirection(-dx, -dy),
        STONE.BLACK.POINT,
      );

      const geumsuPosition = this.findJangmokGeumsu(
        createPosition(x, y),
        createDirection(dx, dy),
        reverseDirectionStones, // 현재 위치 돌 카운팅, 1부터 시작
      );

      if (geumsuPosition) {
        this.geumsu.push(geumsuPosition);
      }
    }

    return this.geumsu;
  }

  /** 장목 금수 위치 찾는 함수 */
  private findJangmokGeumsu(
    position: Position,
    direction: Direction,
    count: number,
  ): Position | undefined {
    const { x, y } = position;
    let { x: nx, y: ny } = createPosition(x, y);
    const { dx, dy } = direction;
    let stoneCount = count || 0;
    let jumpPos;

    while (Board.isValidStonePosition(createPosition(nx, ny))) {
      // 점프한 구간이 있고 카운트가 5가 된 경우 장목 위치 반환
      if (stoneCount === 5 && jumpPos) return jumpPos;

      const currentPosition = createPosition(nx, ny);
      const target = this.board.get(currentPosition);

      if (target === STONE.WHITE.POINT) break;
      // 점프 이후 또 빈 셀을 만난 경우
      if (target === EMPTY && jumpPos) break;
      // 1회 점프 허용(count가 5일시 장목이 될 자리)
      if (target === EMPTY && !jumpPos) jumpPos = createPosition(nx, ny);
      if (target === STONE.BLACK.POINT) stoneCount += 1;

      nx += dx;
      ny += dy;
    }

    return undefined;
  }
}

export default JangmokRule;
