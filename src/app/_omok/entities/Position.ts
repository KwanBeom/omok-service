import { IDirection } from './Direction';

export interface IPosition {
  x: number;
  y: number;
}

class Position {
  constructor(
    readonly x: number,
    readonly y: number,
  ) {}
}

export function move(position: IPosition, direction: IDirection, time: number = 1): IPosition {
  const { dx, dy } = direction;

  return { x: position.x + dx * (time ?? 1), y: position.y + dy * time };
}

export function isSamePosition(position1: IPosition, position2: IPosition) {
  return position1.x === position2.x && position1.y === position2.y;
}

/** 포지션 튜플 생성 */
export type IPositionTuple<N extends number, R extends IPosition[] = []> = R['length'] extends N
  ? R
  : IPositionTuple<N, [...R, IPosition]>;

export type PositionTuple<N extends number, R extends IPosition[] = []> = R['length'] extends N
  ? R
  : PositionTuple<N, [...R, IPosition]>;

export default Position;
