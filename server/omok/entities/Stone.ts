export type StoneColor = 'black' | 'white';

class Stone {
  static readonly point = {
    black: 1,
    white: 2,
  } as const;

  readonly point: (typeof Stone)['point']['black'] | (typeof Stone)['point']['white'];

  constructor(
    readonly color: StoneColor,
    readonly x: number,
    readonly y: number,
    readonly count?: number,
  ) {
    this.color = color;
    this.point = color === 'black' ? 1 : 2;
    this.x = x;
    this.y = y;
    this.count = count;
  }

  /** 돌 점수에 해당하는 색상 반환 */
  static pointToColor(point: Stone['point']): StoneColor {
    return point === 1 ? 'black' : 'white';
  }

  /** 돌 색상에 해당하는 점수 반환 */
  static colorToPoint(color: StoneColor): Stone['point'] {
    return color === 'black' ? 1 : 2;
  }
}

export default Stone;
