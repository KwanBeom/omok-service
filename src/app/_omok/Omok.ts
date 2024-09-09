import Board from './Board';
import RenjuRule, { RenjuGeumsu } from './RenjuRule';
import Stone, { StoneColor } from './Stone';
import { Position } from './types';

class Omok {
  #turn: StoneColor = 'BLACK';

  #board;

  #rule = new RenjuRule();

  #count = 0;

  #prevPos: Position = [0, 0];

  constructor() {
    this.#board = new Board<Stone>();
  }

  /**
   * x행 y열 위치에 돌을 착수하고 다음 턴으로 넘기는 메서드
   * @param x 행 번호
   * @param y 열 번호
   */
  play(row: number, col: number) {
    this.#board.dropStone(row, col, new Stone(this.#turn));
    this.#rule.apply(this.#board.get(), [row, col], this.#count);
    this.#switchPlayer();
    this.#prevPos = [row, col];
  }

  // TODO: 디버깅용 메서드, 삭제 필요
  dropStone(row: number, col: number, color: StoneColor) {
    this.#board.dropStone(row, col, new Stone(color));
    this.#rule.apply(this.#board.get(), [row, col], this.#count);
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
    // 진행된 수가 홀수이면 흑돌, 짝수이면 백돌
    const point = (this.#count % 3) + 1;
    const pointBoard = this.#board
      .get()
      .map((row) => row.map((stone) => stone?.getPoint()));

    // 승리 체크 함수
    function check(
      row: number,
      col: number,
      count: number,
      target: number,
    ): boolean {
      if (row < 0 || row >= 15 || col < 0 || col >= 15) return false;
      if (pointBoard[row][col] !== target) return false;
      if (count === 5) return true;

      return (
        check(row + 1, col, count + 1, target) || // 아래
        check(row - 1, col, count + 1, target) || // 위
        check(row, col + 1, count + 1, target) || // 오른쪽
        check(row, col - 1, count + 1, target) || // 왼쪽
        check(row + 1, col + 1, count + 1, target) || // 아래 오른쪽 대각선
        check(row - 1, col - 1, count + 1, target) || // 위 왼쪽 대각선
        check(row + 1, col - 1, count + 1, target) || // 아래 왼쪽 대각선
        check(row - 1, col + 1, count + 1, target) // 위 오른쪽 대각선
      );
    }

    const result = check(this.#prevPos[0], this.#prevPos[1], 0, point);

    return result;
  }

  /** 금수 위치 반환 */
  getGeumsu(): RenjuGeumsu {
    return this.#rule.getGeumsu();
  }

  /**
   * 플레이어 변경, = 다음턴 진행
   */
  #switchPlayer() {
    this.#turn = this.#turn === 'BLACK' ? 'WHITE' : 'BLACK';
    this.#count += 1;
  }

  // TODO: 삭제 필
  getBoard() {
    return this.#board.get();
  }
}

const omok = new Omok();

const pos = [
  [7, 7],
  [0, 0],
  [7, 8],
  [0, 1],
  [7, 9],
  [0, 2],
  [7, 5],
  [0, 14],
  [7, 4],
  [0, 13],
  [6, 10],
  [0, 12],
  [9, 7],
  [0, 10],
  [10, 6],
  [0, 9],
  [11, 5],
  [0, 8],
  [8, 5],
  [0, 6],
  [9, 5],
  [0, 5],
  [6, 5],
  [1, 14],
  [13, 9],
  [2, 14],
  [13, 14],
  [1, 0],
  [13, 10],
  [2, 0],
  [13, 13],
  [1, 2],
  [13, 11],
];

for (let i = 0; i < pos.length; i += 1) {
  const [row, col] = pos[i];
  omok.play(row, col);
}

omok.dropStone(7, 14, 'BLACK');
omok.dropStone(8, 13, 'BLACK');
omok.dropStone(9, 12, 'BLACK');

omok.dropStone(11, 10, 'BLACK');
omok.dropStone(12, 9, 'BLACK');

console.log(omok.getGeumsu());

export default Omok;
