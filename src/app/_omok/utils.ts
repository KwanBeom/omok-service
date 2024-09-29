import { STONE, StoneColor, StonePoint } from './Stone';

export type Position = ReturnType<typeof createPosition>;

export type Direction = ReturnType<typeof createDirection>;

/** 포지션 튜플 생성 */
export type Positions<N extends number, R extends Position[] = []> = R['length'] extends N
  ? R
  : Positions<N, [...R, Position]>;

export function createPosition(x: number, y: number) {
  return { x, y };
}

export function createDirection(dx: number, dy: number) {
  return { dx, dy };
}

/** 현재 턴의 돌 색상 반환, (ex: 1: 검정, 2: 하양 ...) */
export function getStoneColorByCount(count: number): StoneColor {
  return count % 2 === 1 ? STONE.BLACK.TEXT : STONE.WHITE.TEXT;
}

/** 포인트에 해당하는 돌의 색상을 반환(흑돌: black, 백돌: white) */
export function getStoneColorByPoint(point: StonePoint): StoneColor {
  return point === STONE.BLACK.POINT ? STONE.BLACK.TEXT : STONE.WHITE.TEXT;
}

export function getStonePointByCount(count: number): StonePoint {
  return count % 2 === 1 ? STONE.BLACK.POINT : STONE.WHITE.POINT;
}

export function getStonePointByColor(color: StoneColor): StonePoint {
  return color === 'black' ? STONE.BLACK.POINT : STONE.WHITE.POINT;
}

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
    if (descending) return curr.x - prev.x || curr.y - prev.y;

    return prev.x - curr.x || prev.y - curr.y;
  });
}
