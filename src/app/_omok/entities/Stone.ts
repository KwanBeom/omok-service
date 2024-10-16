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
}

export default Stone;
