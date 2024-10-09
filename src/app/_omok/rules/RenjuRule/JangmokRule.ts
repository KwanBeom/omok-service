import { DIRECTIONS } from '../../constants';
import Board from '../../core/Board';
import Direction from '../../entities/Direction';
import Position from '../../entities/Position';

export type JangmokGeumsuDatas = Position[];

class JangmokRule {
  private board: Board = new Board();

  private geumsu: JangmokGeumsuDatas = [];

  apply(board: Board, position: Position) {
    this.board = board;

    for (let i = 0; i < DIRECTIONS.length; i += 1) {
      const direction = DIRECTIONS[i];
      const reverse = direction.reverse();

      // 반대 방향 돌 카운팅
      const reverseDirectionStones = this.board.countStones(
        position.move(reverse.dx, reverse.dy),
        reverse,
        'black',
      );

      const geumsuPosition = this.findJangmokGeumsu(
        position,
        direction,
        reverseDirectionStones, // 현재 위치 돌 카운팅, 1부터 시작
      );

      if (geumsuPosition) {
        this.geumsu.push(geumsuPosition);
      }
    }

    return this.geumsu;
  }

  haegeum(board: Board) {
    this.board = board;
    this.geumsu = this.geumsu.filter((position) => {
      const canFiveInARow = this.board.isNConnected(position, 'black', 4, {
        assumeStonePlaced: true,
      });

      if (canFiveInARow) return false;

      return true;
    });

    return this.geumsu;
  }

  /** 장목 금수 위치 찾는 함수 */
  private findJangmokGeumsu(
    position: Position,
    direction: Direction,
    count: number,
  ): Position | undefined {
    const { x, y } = position;
    let { x: nx, y: ny } = new Position(x, y);
    const { dx, dy } = direction;
    let stoneCount = count || 0;
    let jumpPos;

    while (Board.isValidStonePosition(new Position(nx, ny))) {
      // 점프한 구간이 있고 카운트가 5가 된 경우 장목 위치 반환
      if (stoneCount === 5 && jumpPos) return jumpPos;

      const currentPosition = new Position(nx, ny);
      const target = this.board.get(currentPosition);

      if (target?.color === 'white') break;
      // 점프 이후 또 빈 셀을 만난 경우
      if (this.board.canDropStone(currentPosition) && jumpPos) break;
      // 1회 점프 허용(count가 5일시 장목이 될 자리)
      if (this.board.canDropStone(currentPosition) && !jumpPos) jumpPos = new Position(nx, ny);
      if (target?.color === 'black') stoneCount += 1;

      nx += dx;
      ny += dy;
    }

    return undefined;
  }
}

export default JangmokRule;
