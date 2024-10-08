type DirectionXY = 0 | 1 | -1;

class Direction {
  constructor(
    readonly dx: DirectionXY,
    readonly dy: DirectionXY,
  ) {
    this.dx = dx;
    this.dy = dy;
  }

  /** 역방향 반환 */
  reverse() {
    return new Direction((this.dx * -1) as DirectionXY, (this.dy * -1) as DirectionXY);
  }
}

export default Direction;
