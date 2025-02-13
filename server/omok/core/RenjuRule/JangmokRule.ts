import Board from '../Board';
import Direction from '../../entities/Direction';
import { IPosition } from '../../entities/Position';

export type JangmokGeumsuDatas = IPosition[];

class JangmokRule {
  private board: Board = new Board();

  private geumsu: JangmokGeumsuDatas = [];

  apply(board: Board, position: IPosition) {
    this.board = board;

    const directions = Direction.getAll();

    for (let i = 0; i < directions.length; i += 1) {
      const direction = directions[i];
      const reverse = Direction.reverse(direction);

      // 반대 방향 돌 카운팅
      const reverseDirectionStones = this.board.countStones(position, reverse, 'black');
      const geumsuPosition = this.findJangmokGeumsu(position, direction, reverseDirectionStones);

      if (geumsuPosition) this.geumsu.push(geumsuPosition);
    }

    return this.geumsu;
  }

  haegeum(board: Board) {
    this.board = board;
    this.geumsu = this.geumsu.filter((position) => {
      const canFiveInARow = this.board.isNConnected(position, 'black', 5, {
        assumeStonePlaced: true,
        strictMode: true,
      });

      if (canFiveInARow) return false;

      return true;
    });

    return this.geumsu;
  }

  /** 장목 금수 위치 찾는 함수 */
  private findJangmokGeumsu(
    position: IPosition,
    direction: Direction,
    count: number,
  ): IPosition | undefined {
    let { x, y } = position;
    const { dx, dy } = direction;
    let stoneCount = count || 0;
    let jumpPos;

    while (Board.isValidStonePosition({ x, y })) {
      if (!Board.isValidStonePosition({ x, y })) break;

      // 점프한 구간이 있고 카운트가 5가 된 경우 장목 위치 반환
      if (stoneCount === 5 && jumpPos) return jumpPos;

      const target = this.board.get({ x, y });

      if (target?.color === 'white') break;
      // 점프 이후 또 빈 셀을 만난 경우
      if (this.board.canDropStone({ x, y }) && jumpPos) break;
      // 1회 점프 허용(count가 5일시 장목이 될 자리)
      if (this.board.canDropStone({ x, y }) && !jumpPos) jumpPos = { x, y };
      if (target?.color === 'black') stoneCount += 1;

      x += dx;
      y += dy;
    }

    return undefined;
  }
}

export default JangmokRule;
