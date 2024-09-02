export const EMPTY = null;

/**
 * 오목판 클래스
 */
// 제네릭으로 오목판 cell의 인스턴스의 형태를 타입스크립트가 추론하도록 함
export class Board<T> {
  #MAX = 15;

  #MIN = 0;

  #board: T[][] = Array.from({ length: this.#MAX }, () =>
    new Array(this.#MAX).fill(EMPTY),
  );

  /**
   * 보드에 돌을 착수하는 메서드
   * @param row 열
   * @param col 행
   * @param stone 놓아질 돌
   */
  dropStone(row: number, col: number, stone: T) {
    if (
      row < this.#MIN ||
      row > this.#MAX ||
      col < this.#MIN ||
      col > this.#MAX
    ) {
      throw new Error('올바르지 않은 착수 위치입니다');
    }

    if (this.#board[row][col] !== EMPTY) {
      throw new Error('이미 돌이 놓여진 자리입니다');
    }

    this.#board[row][col] = stone;
  }

  get() {
    return this.#board;
  }
}
