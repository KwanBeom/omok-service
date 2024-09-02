export type StoneColor = 'black' | 'white';
export const POINT = { BLACK: 1, WHITE: 2 };

export default class Stone {
  color;

  constructor(color: StoneColor) {
    this.color = color;
  }

  /**
   * 승리조건 계산을 위한 돌 점수 반환
   * @returns 흑돌이면 1 백돌이면 2
   */
  getPoint() {
    return this.color === 'black' ? POINT.BLACK : POINT.WHITE;
  }
}
