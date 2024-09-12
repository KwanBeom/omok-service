import Board from './Board';
import RenjuRule, { RenjuGeumsu } from './RenjuRule';
import Stone, {
  POINT_BLACK,
  POINT_WHITE,
  StoneColor,
  StonePoint,
} from './Stone';
import { Position } from './types';
import {
  changeStoneToPoint,
  countStones,
  countStonesInBothDirections,
  isValidStonePosition,
} from './utils';

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
    this.#count += 1;
    this.#switchPlayer();
    this.#rule.apply(this.#board.get(), [row, col], this.#count);
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

    const directions: Position[] = [
      [1, 0], // 우
      [0, 1], // 상
      [1, 1], // 우상 대각
      [1, -1], // 우하 대각
    ];

    const target = this.#count % 2 === 0 ? POINT_WHITE : POINT_BLACK;
    const board = this.#board.get();
    const prev = this.#prevPos;

    for (let i = 0; i < directions.length; i++) {
      const count = countStonesInBothDirections(
        board,
        prev,
        directions[i],
        target,
      );

      if (count >= 5) {
        return true; // 5개 이상의 돌이 연결되면 승리
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
  }

  getBoard() {
    return this.#board.get();
  }
}

export default Omok;
