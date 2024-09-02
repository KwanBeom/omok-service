import { Board } from './Board';
import Stone, { StoneColor } from './Stone';

export default class Omok {
  #turn: StoneColor = 'black';

  #board;

  #count = 0;

  #prevPos = { row: 0, col: 0 };

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
    this.#switchPlayer();
    this.#prevPos = { row, col };
  }

  // TODO: 디버깅 메소드, 삭제 필요
  view() {
    const board = this.#board
      .get()
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
      .join('\n');

    console.log(board);
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

    const result = check(this.#prevPos.row, this.#prevPos.col, 0, point);

    return result;
  }

  /**
   * 다음 턴 실행
   */
  #switchPlayer() {
    this.#turn = this.#turn === 'black' ? 'white' : 'black';
    this.#count += 1;
  }
}

const omok = new Omok();

omok.play(0, 0);
omok.play(7, 7);
omok.play(0, 1);
omok.play(7, 8);
omok.play(0, 2);
omok.play(7, 9);
omok.play(0, 3);
omok.play(7, 10);

omok.view();
console.log(omok.checkWin());
