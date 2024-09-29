import Board from '../Board';
import OmokAnalyzer from '../OmokAnalyzer';
import { createPosition, Position, Positions, sortPositions } from '../utils';
import GeumsuRule from './GeumsuRule';

type ThreeStonePositions = Positions<3>;

class SasaGeumsu implements GeumsuRule {
  private board: Board;

  private geumsu: { position: Position; threePositions: ThreeStonePositions[] }[] = [];

  constructor() {
    this.board = new Board();
  }

  get() {
    return this.geumsu.map((data) => data.position);
  }

  check(board: Board, position: Position) {
    return this.checkCanSasa(positions);
  }

  apply(board: Board, position: Position) {
    // 4*4 금수 가능한 위치 찾기
    const findCanSasaPositions = (positions: ThreeStonePositions): Position[] => {
      const result: Position[] = [];
      const sortedPositions = sortPositions(positions);
      const firstStone = sortedPositions[0];
      const lastStone = sortedPositions[2];
      const { dx, dy } = OmokAnalyzer.getDirection(firstStone, lastStone);

      const nextFirst = createPosition(firstStone.x + -dx, firstStone.y + -dy);
      const afterNextFirst = createPosition(firstStone.x + -dx * 2, firstStone.y + -dy * 2);
      const nextLast = createPosition(lastStone.x + dx, lastStone.y + dy);
      const afterNextLast = createPosition(lastStone.x + dx * 2, lastStone.y + dy * 2);
      const bothSideEmpty = this.board.canDropStone(nextFirst) && this.board.canDropStone(nextLast);

      // 3이 나란히 이어져 있는 경우, (OOO)
      if (OmokAnalyzer.isSequential(sortedPositions)) {
        if (this.board.canDropStone(nextFirst) && this.board.canDropStone(afterNextFirst)) {
          result.push(afterNextFirst);
          result.push(nextFirst);
        }

        if (this.board.canDropStone(nextLast) && this.board.canDropStone(afterNextLast)) {
          result.push(afterNextLast);
          result.push(nextLast);
        }
      } else {
        // 띈 3인 경우, (OVOO)
        // 양 사이가 비어있는 경우 띈 위치 추가
        if (bothSideEmpty) {
          let { x, y } = sortedPositions[0];

          for (let i = 0; i < sortedPositions.length; i += 1) {
            if (!(sortedPositions[i].x === x && sortedPositions[i].y === y)) {
              result.push(createPosition(x, y));
              break;
            }

            x += dx;
            y += dy;
          }
        }

        if (this.board.canDropStone(nextFirst) && this.board.canDropStone(afterNextFirst)) {
          result.push(nextFirst);
        }

        if (this.board.canDropStone(nextLast) && this.board.canDropStone(afterNextLast)) {
          result.push(nextLast);
        }
      }

      return result;
    };

    const connectedThrees = this.board.findConnectedStones(position, 3);
    // console.log(connectedThrees);

    for (let i = 0; i < connectedThrees.length; i += 1) {
      const canSasaPositions = findCanSasaPositions(connectedThrees[i]);
      // console.log(canSasaPositions);
      for (let j = 0; j < canSasaPositions.length; j += 1) {
        const threes = this.board.findConnectedStones(canSasaPositions[j], 3);

        if (threes.length >= 2) {
          if (this.checkCanSasa(canSasaPositions[j], threes)) {
            this.geumsu.push({ position: canSasaPositions[j], threePositions: threes });
          }
        }
      }
    }

    return this.geumsu.map((data) => data.position);
  }

  /** spot 위치가 4*4가 되는지 확인 */
  private checkCanSasa(spot: Position, threeStones: ThreeStonePositions[]) {
    const filteredThreeStones = threeStones.filter((threeStone) => {
      const sortedPositions = sortPositions([spot, ...threeStone]);
      console.log(spot, sortedPositions);
      const firstStone = sortedPositions[0];
      const lastStone = sortedPositions[2];

      // 이어진 3개 돌에서 4*4 금수 가능 위치로 향하는 방향
      const { dx, dy } = OmokAnalyzer.getDirection(spot, threeStone[0]);
      const firstToLast = OmokAnalyzer.getDirection(firstStone, lastStone);

      // console.log(dx, dy, firstToLast);

      // 만약 이어진 3개 돌에서 4*4 금수 가능 위치로 가는 방향이 동일하면 좋겠지만..
      // 그렇지 않은 경우가 있기 때문에 마지막 돌에서 4*4 가는 방향과
      // 첫번째 돌에서 가는 방향을 구한 다음
      // 4*4 금수 방향 반대편에 있는 돌을 구해야함
    });

    // console.log(threeStones);

    return filteredThreeStones.length >= 2;
  }
}

export default SasaGeumsu;
