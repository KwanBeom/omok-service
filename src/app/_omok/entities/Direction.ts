export interface IDirection {
  dx: number;
  dy: number;
}

type DirectionXY = 0 | 1 | -1;

class Direction {
  static LEFT = new Direction(0, -1);

  static RIGHT = new Direction(0, 1);

  static DOWN = new Direction(1, 0);

  static UP = new Direction(-1, 0);

  static UP_RIGHT = new Direction(-1, 1);

  static DOWN_RIGHT = new Direction(1, 1);

  static UP_LEFT = new Direction(-1, -1);

  static DOWN_LEFT = new Direction(1, -1);

  constructor(
    readonly dx: DirectionXY,
    readonly dy: DirectionXY,
  ) {}

  /** 역방향 반환 */
  static reverse(direction: Direction) {
    return new Direction((direction.dx * -1) as DirectionXY, (direction.dy * -1) as DirectionXY);
  }

  /** 모든 방향 반환 */
  static getAll() {
    return [
      Direction.LEFT,
      Direction.RIGHT,
      Direction.UP,
      Direction.DOWN,
      Direction.UP_LEFT,
      Direction.UP_RIGHT,
      Direction.DOWN_LEFT,
      Direction.DOWN_RIGHT,
    ];
  }

  /** 방향의 절반 반환(좌, 상, 좌상, 좌하) */
  static getHalf() {
    return [Direction.LEFT, Direction.UP, Direction.UP_LEFT, Direction.DOWN_LEFT];
  }
}

export default Direction;
