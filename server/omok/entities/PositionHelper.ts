import { IPosition, IPositionTuple } from './Position';
import Direction from './Direction';

class PositionHelper {
  /** 돌들이 나란히 이어져 있는지 확인 */
  static isSequential(positions: IPosition[]) {
    const { dx, dy } = this.getDirection(positions[0], positions[positions.length - 1]);

    for (let i = 0; i < positions.length - 1; i += 1) {
      const moved = { x: positions[i].x + dx, y: positions[i].y + dy };
      const next = positions[i + 1];

      if (!(moved.x === next.x && moved.y === next.y)) {
        return false;
      }
    }

    return true;
  }

  /** 1칸 스킵 허용하고 돌들이 나란히 이어져 있는지 확인 */
  static isSequentialSkipOnce(positions: IPosition[]) {
    let { x, y } = positions[0];
    let skip = false;
    const { dx, dy } = this.getDirection(positions[0], positions[positions.length - 1]);

    for (let i = 0; i < positions.length - 1; i += 1) {
      const next = positions[i + 1];

      if (!(x + dx === next.x && y + dy === next.y)) {
        if (skip) return false;

        skip = true;

        x += dx;
        y += dy;
      }

      x += dx;
      y += dy;
    }

    return true;
  }

  /** 나란히 위치한 포지션에서 띈 위치 반환 */
  static getSkippedPosition(positions: IPosition[]): IPosition {
    const { dx, dy } = this.getDirection(positions[0], positions[positions.length - 1]);
    let { x, y } = positions[0];

    for (let i = 0; i < positions.length; i += 1) {
      if (!(positions[i].x === x && positions[i].y === y)) {
        break;
      }

      x += dx;
      y += dy;
    }

    return { x, y };
  }

  static sort<N extends IPosition[]>(
    positions: N,
    descending?: boolean,
  ): IPositionTuple<N['length']> {
    return positions.sort((prev, curr) => {
      const { x: prevX, y: prevY } = prev;
      const { x: currX, y: currY } = curr;

      if (descending) return currX - prevX || currY - prevY;

      return prevX - currX || prevY - currY;
    }) as IPositionTuple<N['length']>;
  }

  /** position1 -> position2로 향하는 방향 */
  static getDirection(position1: IPosition, position2: IPosition) {
    const change = (n: number) => {
      if (n < 0) return 1;
      if (n > 0) return -1;
      return 0;
    };

    return new Direction(change(position1.x - position2.x), change(position1.y - position2.y));
  }

  /** 두 돌 간 거리를 반환 */
  static getDistance(position1: IPosition, position2: IPosition) {
    const distance = Math.abs(position1.x - position2.x || position1.y - position2.y);

    return distance;
  }

  /** 중복된 포지션 제거 */
  static removeDuplicates<N extends IPosition[]>(positions: N): IPositionTuple<N['length']> {
    return positions.filter(
      (position, index, self) =>
        index === self.findIndex((p) => p.x === position.x && p.y === position.y),
    ) as IPositionTuple<N['length']>;
  }

  /** 포지션 배열 중복 제거 */
  static removeDuplicatePositionArray<N extends IPosition[]>(
    array: N[],
  ): IPositionTuple<N['length']>[] {
    const seen = new Set<string>();
    const result: N[] = [];

    array.forEach((pair) => {
      // 각 Position 배열에서 첫 번째 Position과 두 번째 Position의 문자열 표현을 만듦
      const key = pair.map((position) => `${position.x},${position.y}`).join('-');

      if (!seen.has(key)) {
        seen.add(key);
        result.push(pair); // 중복되지 않으면 결과 배열에 추가
      }
    });

    return result as IPositionTuple<N['length']>[];
  }
}

export default PositionHelper;
