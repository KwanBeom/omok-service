import Position from './Position';

export type StoneColor = 'black' | 'white';

class Stone {
  static readonly point = {
    black: 1,
    white: 2,
  } as const;

  readonly point: (typeof Stone)['point']['black'] | (typeof Stone)['point']['white'];

  constructor(
    readonly color: StoneColor,
    readonly position?: Position,
  ) {
    this.color = color;
    this.point = color === 'black' ? 1 : 2;
    this.position = position;
  }
}

export default Stone;
