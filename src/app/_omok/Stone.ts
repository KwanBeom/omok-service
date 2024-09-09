export type StoneColor = 'BLACK' | 'WHITE';

export type StonePoint = 1 | 2;

export const STONE_POINT: { [key in StoneColor]: StonePoint } = {
  BLACK: 1,
  WHITE: 2,
} as const;

export default class Stone {
  #color;

  constructor(color: StoneColor) {
    this.#color = color;
  }

  /**
   * 돌 점수 반환
   * @returns 흑돌이면 1 백돌이면 2
   */
  getPoint() {
    return this.#color === 'BLACK' ? STONE_POINT.BLACK : STONE_POINT.WHITE;
  }
}
