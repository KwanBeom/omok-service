import { EMPTY } from './Board';
import { POINT_BLACK, POINT_WHITE } from './Stone';
import { Position, StoneBoard } from './types';
import { countStones, isValidStonePosition } from './utils';

export type RenjuGeumsu = {
  samsam: Position[];
  sasa: Position[];
  jangmok: Position[];
};

const dx = [1, 0, -1, 0, 1, 1, -1, -1];
const dy = [0, 1, 0, -1, 1, -1, 1, -1];

class RenjuRule {
  #geumsu: RenjuGeumsu = {
    samsam: [],
    sasa: [],
    jangmok: [],
  };

  /** 금수 위치 반환 */
  getGeumsu() {
    return this.#geumsu;
  }

  /**
   * 룰 적용
   */
  apply(board: StoneBoard, position: Position, count: number) {
    if (count >= 6) {
      this.#jangmok(board, position);
    }
  }

  /** 흑 33 금수 */
  #samsam() {}

  /** 흑 44 금수 */
  #sasa() {}

  /** 흑 장목(6목) */
  #jangmok(board: StoneBoard, position: Position) {
    /** 장목 금수 위치 찾는 재귀함수 */
    const find = (
      pos: Position,
      direction: Position,
      count: number,
      jumpPos?: Position,
    ): Position | undefined => {
      // 점프한 구간이 있고 카운트가 5가 된 경우 장목 위치 반환
      if (count === 5 && jumpPos) {
        return jumpPos;
      }

      const [nx, ny] = [pos[0] + direction[0], pos[1] + direction[1]];

      // 유효하지 않은 위치인 경우
      if (!isValidStonePosition([nx, ny])) {
        return undefined;
      }

      // 점프 이후 또 빈 셀을 만난 경우
      if (board[nx][ny] === EMPTY && jumpPos) {
        return undefined;
      }

      // 흑돌이 아닌 경우
      if (board[nx][ny]?.getPoint() === POINT_WHITE) {
        return undefined;
      }

      // 1회 점프 허용(count가 5일시 장목이 될 자리)
      if (board[nx][ny] === EMPTY && !jumpPos) {
        return find([nx, ny], direction, count, [nx, ny]);
      }

      return find([nx, ny], direction, count + 1, jumpPos);
    };

    for (let i = 0; i < dx.length; i += 1) {
      // 이동할 방향으로 움직인 좌표
      const [newX, newY] = [position[0] + dx[i], position[1] + dy[i]];
      let osc = 0; // opposite stones count

      if (isValidStonePosition([newX, newY])) {
        // reverse, 반대 방향
        const [rdX, rdY] = [-dx[i], -dy[i]];
        const [rX, rY] = [position[0] + rdX, position[1] + rdY];

        // 반대 방향 돌 갯수 세기 ..
        if (isValidStonePosition([rX, rY])) {
          osc = countStones(board, [rX, rY], [rdX, rdY], POINT_BLACK);
        }
      }

      const geumsuPosition = find(position, [dx[i], dy[i]], 1 + osc);

      if (geumsuPosition) {
        this.#geumsu.jangmok.push(geumsuPosition);
      }
    }
  }
}

export default RenjuRule;
