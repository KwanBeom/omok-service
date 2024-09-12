import Board from './Board';
import RenjuRule, { RenjuGeumsu } from './RenjuRule';
import Stone, { POINT_BLACK, POINT_WHITE, StoneColor } from './Stone';
import { Position } from './types';
import { changeStoneToPoint, countStones, isValidStonePosition } from './utils';

class Omok {
  #turn: StoneColor = 'black';

  #prevPos: Position = [0, 0];

  #board;

  #rule;

  #count;

  constructor() {
    this.#board = new Board<Stone>();
    this.#rule = new RenjuRule();
    this.#count = 0;
  }

  /**
   * position 위치에 돌을 착수하고 다음 턴으로 넘기는 메서드
   */
  play(position: Position) {
    const [row, col] = position;

    this.#board.dropStone(row, col, new Stone(this.#turn));
    this.#rule.apply(this.#board.get(), [row, col], this.#count);
    this.#switchPlayer();
    this.#prevPos = [row, col];
  }

  /**
   * 몇 수 진행되었는지 확인하는 메서드
   */
  getCount() {
    return this.#count;
  }

  /**
   * 승리 여부 확인 메서드
   */
  checkWin() {
    if (this.#count < 9) return false;

    const direction: Position[] = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];

    // 진행된 수가 홀수이면 흑돌, 짝수이면 백돌
    const target = this.#count % 2 === 0 ? POINT_WHITE : POINT_BLACK;
    const pointBoard = changeStoneToPoint(this.#board.get());
    const board = this.#board.get();
    const prev = this.#prevPos;

    // 승리 체크 함수
    function check(p: Position, d: Position, count: number): boolean {
      if (count === 5) return true;

      const [nx, ny] = [p[0] + d[0], p[1] + d[1]];

      if (isValidStonePosition([nx, ny]) && pointBoard[nx][ny] === target) {
        if (count === 1) {
          const reverseDirection: Position = [-d[0], -d[1]];
          // 반대편 돌 세기
          const osc = countStones(board, prev, reverseDirection, target);
          console.log(osc);

          return check([nx, ny], d, osc + count + 1);
        }

        return check([nx, ny], d, count + 1);
      }

      return false;
    }

    for (let i = 0; i < direction.length; i += 1) {
      if (check(this.#prevPos, direction[i], 1)) {
        return true;
      }
    }

    return false;
  }

  /** 금수 위치 반환 */
  getGeumsu(): RenjuGeumsu {
    return this.#rule.getGeumsu();
  }

  /**
   * 플레이어 변경, = 다음턴 진행
   */
  #switchPlayer() {
    this.#turn = this.#turn === 'black' ? 'white' : 'black';
    this.#count += 1;
  }

  getBoard() {
    return this.#board.get();
  }
}

export default Omok;
