import { BLACK_STONE, WHITE_STONE } from './Stone';

export const EMPTY = null;

export class Board {
  #board = Array.from({ length: 15 }, () => new Array(15).fill(EMPTY));

  /**
   * 돌 보드에 놓는 메서드
   * @param x 열
   * @param y 행
   * @param stone 놓아질 돌
   */
  dropStone(x: number, y: number, stone: unknown) {
    this.#board[x][y] = stone;
  }

  get() {
    return this.#board;
  }

  // TODO: 디버깅용 메서드, 삭제 필요
  view() {
    type Cell = typeof BLACK_STONE | typeof WHITE_STONE | typeof EMPTY;

    const board = this.#board
      .map((row) =>
        row
          .map((cell: Cell) => {
            if (cell === BLACK_STONE) return '⚫️';
            if (cell === WHITE_STONE) return '⚪️';
            return 'x';
          })
          .join(' '),
      )
      .join('\n');

    console.log(board);
  }
}
const board = new Board();

board.dropStone(7, 7, BLACK_STONE);
board.dropStone(0, 0, WHITE_STONE);
board.dropStone(7, 8, BLACK_STONE);
board.dropStone(0, 1, WHITE_STONE);
board.view();
