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

export default Position;

/** 포지션 튜플 생성 */
export type Positions<N extends number, R extends Position[] = []> = R['length'] extends N
  ? R
  : Positions<N, [...R, Position]>;

/**
 * 포지션 정렬
 * @param positions 포지션 배열
 * @param descending 기본 값은 false, true로 변경시 오름차순 정렬
 * @returns 정렬된 포지션 배열
 */
export function sortPositions<T extends Position[]>(
  positions: T,
  descending: boolean = false,
): [...T] {
  return positions.sort((prev, curr) => {
    const { x: prevX, y: prevY } = prev;
    const { x: currX, y: currY } = curr;

    if (descending) return currX - prevX || currY - prevY;

    return prevX - currX || prevY - currY;
  });
}
