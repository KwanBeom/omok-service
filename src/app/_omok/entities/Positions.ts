import { IPosition, IPositionTuple } from './Position';
import OmokAnalyzer from '../core/OmokAnalyzer';

class Positions<N extends IPosition[]> {
  private positions: IPosition[];

  constructor(...positions: N) {
    this.positions = positions;
  }

  /** 배열 길이 반환 */
  length() {
    return this.positions.length;
  }

  /** 특정 인덱스의 Position 반환 */
  get(index: number): IPosition | undefined {
    return this.positions[index];
  }

  /** 모든 Position을 반환 */
  getAll(): IPositionTuple<N['length']> {
    return this.positions as IPositionTuple<N['length']>;
  }

  /** Position 추가 */
  add(position: IPosition) {
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
    this.positions.sort((prev, curr) => {
      const { x: prevX, y: prevY } = prev;
      const { x: currX, y: currY } = curr;

      if (descending) return currX - prevX || currY - prevY;

      return prevX - currX || prevY - currY;
    });

    return this;
  }

  clear() {
    this.positions = [];
  }

  /** 돌들이 나란히 이어져 있는지 확인 */
  static isSequential(positions: IPosition[]) {
    const { dx, dy } = OmokAnalyzer.getDirection(positions[0], positions[positions.length - 1]);

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
    const { dx, dy } = OmokAnalyzer.getDirection(positions[0], positions[positions.length - 1]);

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
  static getSkippedPosition(positions: IPosition[]): IPosition | undefined {
    const { dx, dy } = OmokAnalyzer.getDirection(positions[0], positions[positions.length - 1]);
    let { x, y } = positions[0];

    for (let i = 0; i < positions.length; i += 1) {
      if (!(positions[i].x === x && positions[i].y === y)) {
        return { x, y };
      }

      x += dx;
      y += dy;
    }

    return undefined;
  }
}

export default Positions;
