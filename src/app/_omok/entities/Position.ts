class Position {
  constructor(
    readonly x: number,
    readonly y: number,
  ) {
    this.x = x;
    this.y = y;
  }

  /** 해당 포지션에서 이동한 새로운 포지션 반환 */
  move(x: number, y: number, time?: number) {
    return new Position(this.x + x * (time ?? 1), this.y + y * (time ?? 1));
  }

  isSame(position: Position) {
    const { x, y } = position;

    return this.x === x && this.y === y;
  }
}

/** 포지션 튜플 생성 */
export type PositionTuple<N extends number, R extends Position[] = []> = R['length'] extends N
  ? R
  : PositionTuple<N, [...R, Position]>;

export default Position;
