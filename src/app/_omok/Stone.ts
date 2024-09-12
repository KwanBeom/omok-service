export type StoneColor = 'black' | 'white';

export const POINT_BLACK = 1 as const;
export const POINT_WHITE = 2 as const;

export type StonePoint = typeof POINT_BLACK | typeof POINT_WHITE;

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
    return this.#color === 'black' ? POINT_BLACK : POINT_WHITE;
  }
}
