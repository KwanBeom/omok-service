export const EMPTY = null;

// 15*15, 배열 인덱싱 0 ~ 14
export const BOARD_SIZE = 14;

/**
 * 오목판 클래스
 */
class Board<T> {
  #board: (T | typeof EMPTY)[][] = Array.from({ length: BOARD_SIZE + 1 }, () =>
    new Array(BOARD_SIZE + 1).fill(EMPTY),
  );

  /**
   * 보드에 돌을 착수하는 메서드
   * @param row 열
   * @param col 행
   * @param stone 놓아질 돌
   */
  dropStone(row: number, col: number, stone: T) {
    if (row < 0 || row > BOARD_SIZE || col < 0 || col > BOARD_SIZE) {
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

export default Board;
