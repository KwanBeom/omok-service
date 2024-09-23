import { STONE, StoneColor, StonePoint } from './Stone';

export type Position = ReturnType<typeof createPosition>;

export type Direction = ReturnType<typeof createDirection>;

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

/** 두 돌 간 거리를 반환 */
export function getDistance(position1: Position, position2: Position) {
  const distance = Math.abs(position1.x - position2.x || position1.y - position2.y);

  return distance;
}

export function getStonePointByColor(color: StoneColor): StonePoint {
  return color === 'black' ? STONE.BLACK.POINT : STONE.WHITE.POINT;
}
