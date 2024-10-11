import Direction from './Direction';
import Position, { PositionTuple } from './Position';

class Positions<N extends Position[]> {
  private positions: Position[];

  constructor(...positions: N) {
    this.positions = positions;
  }

  /** 배열 길이 반환 */
  length() {
    return this.positions.length;
  }

  /** 특정 인덱스의 Position 반환 */
  get(index: number): Position | undefined {
    return this.positions[index];
  }

  /** 모든 Position을 반환 */
  getAll(): PositionTuple<N['length']> {
    return this.positions as PositionTuple<N['length']>;
  }

  /** Position 추가 */
  add(position: Position) {
    this.positions.push(position);
  }

  /** 중복된 Position 제거 */
  removeDuplicates(): void {
    this.positions = this.positions.filter(
      (position, index, self) =>
        index === self.findIndex((p) => p.x === position.x && p.y === position.y),
    );
  }

  /** Position 정렬 */
  sort(descending: boolean = false) {
    return this.positions.sort((prev, curr) => {
      const { x: prevX, y: prevY } = prev;
      const { x: currX, y: currY } = curr;

      if (descending) return currX - prevX || currY - prevY;

      return prevX - currX || prevY - currY;
    });
  }

  clear() {
    this.positions = [];
  }

  // }

  /** position1 -> position2로 향하는 방향 */
  static getDirection(position1: Position, position2: Position) {
    const change = (n: number) => {
      if (n < 0) return 1;
      if (n > 0) return -1;
      return 0;
    };

    return new Direction(change(position1.x - position2.x), change(position1.y - position2.y));
  }

  /** 두 돌 간 거리를 반환 */
  static getDistance(position1: Position, position2: Position) {
    const distance = Math.abs(position1.x - position2.x || position1.y - position2.y);

    return distance;
  }
}

export default Positions;
