import Board from '../../core/Board';
import OmokAnalyzer from '../../core/OmokAnalyzer';
import Position, { PositionTuple } from '../../entities/Position';
import Positions from '../../entities/Positions';

type TwoStonePositions = PositionTuple<2>;

export type SamsamGeumsuDatas = { position: Position; openTwoStones: TwoStonePositions[] }[];

/** 렌주룰 3*3 금수 */
class SamsamRule {
  private geumsu: SamsamGeumsuDatas = [];

  private board = new Board();

  apply(board: Board, position: Position) {
    this.board = board;

    const connectedTwos = this.board.findConnectedStones(position, 'black', 2, {
      skip: 2,
    });
    const canSamsamPositions: Position[] = [];

    for (let i = 0; i < connectedTwos.length; i += 1) {
      if (OmokAnalyzer.checkOpenTwo(this.board, connectedTwos[i])) {
        canSamsamPositions.push(...this.findCanSamsamPositions(connectedTwos[i]));
      }
    }

    for (let j = 0; j < canSamsamPositions.length; j += 1) {
      const canSamsamPosition = canSamsamPositions[j];
      // 3*3 가능 자리 기준 연결된 2 탐색, 그 중 open two
      const openTwoStones = this.findOpenTwos(canSamsamPosition);

      // 3*3 가능한 자리가 금수 위치인지 확인 후 추가
      if (this.checkCanSamsam(canSamsamPositions[j], openTwoStones)) {
        this.geumsu.push({
          position: canSamsamPositions[j],
          openTwoStones,
        });
      }
    }

    return this.geumsu.map((data) => data.position);
  }

  haegeum(board: Board) {
    this.board = board;

    this.geumsu = this.geumsu.filter(({ position, openTwoStones }) => {
      if (!this.board.canDropStone(position)) return false;

      const canFiveInARow = this.board.isNConnected(position, 'black', 5, {
        assumeStonePlaced: true,
      });

      if (canFiveInARow) return false;

      return this.checkCanSamsam(position, openTwoStones);
    });

    return this.geumsu.map((data) => data.position);
  }

  /** open two들로 spot 위치가 3*3이 되는지 확인 */
  checkCanSamsam(spot: Position, openTwos: TwoStonePositions[]) {
    if (openTwos.length < 2) return false;

    const filteredOpenTwos = openTwos.filter((openTwo) => {
      const positions = new Positions(spot, ...openTwo);
      positions.sort();
      const sortedPositions = positions.getAll();
      const first = sortedPositions[0];
      const last = sortedPositions[sortedPositions.length - 1];
      const direction = Positions.getDirection(first, last);
      const reverse = direction.reverse();
      const beforeFirst = first.move(reverse.dx, reverse.dy);
      const afterLast = last.move(direction.dx, direction.dy);

      // 열린 3이고 다음 수순에 열린 4를 만들 수 있는지 확인
      return (
        OmokAnalyzer.checkOpenThree(this.board, [spot, ...openTwo]) &&
        (OmokAnalyzer.checkOpenFour(this.board, [spot, ...openTwo, beforeFirst]) ||
          OmokAnalyzer.checkOpenFour(this.board, [spot, ...openTwo, afterLast]))
      );
    });

    // 교점에 3*3을 만들 수 있는 조건에 부합하는 돌들이 둘 이상인지 확인
    return filteredOpenTwos.length >= 2;
  }

  /** 3*3 금수 가능한 위치 찾기 */
  private findCanSamsamPositions(twoStones: TwoStonePositions): Position[] {
    const result = [];
    const [first, second] = twoStones;
    const direction = Positions.getDirection(first, second);
    const reverse = direction.reverse();
    const distance = Positions.getDistance(first, second);

    const nextFirst = first.move(reverse.dx, reverse.dy);
    const afterNextFirst = first.move(reverse.dx, reverse.dy, 2);
    const nextSecond = second.move(direction.dx, direction.dy);
    const afterNextSecond = second.move(direction.dx, direction.dy, 2);

    const checkOpenThreeWithPosition = (pos: Position) =>
      this.board.canDropStone(pos) && OmokAnalyzer.checkOpenThree(this.board, [first, second, pos]);

    switch (distance) {
      // 붙은 2 (OO)
      case 1: {
        // 이은 3 위치가 열린 3인지 확인 후 3*3 가능 위치 추가
        if (checkOpenThreeWithPosition(nextSecond)) result.push(nextSecond);
        if (checkOpenThreeWithPosition(nextFirst)) result.push(nextFirst);
        // 띈 3 위치가 열린 3인지 확인 후 3*3 가능 위치 추가
        if (checkOpenThreeWithPosition(afterNextSecond)) result.push(afterNextSecond);
        if (checkOpenThreeWithPosition(afterNextFirst)) result.push(afterNextFirst);

        break;
      }

      // 1칸 띈 2 (OVO)
      case 2: {
        // 띈 2 사이 낀 위치 3*3 가능 위치 추가
        result.push(first.move(direction.dx, direction.dy));

        if (checkOpenThreeWithPosition(nextSecond)) result.push(nextSecond);
        if (checkOpenThreeWithPosition(nextFirst)) result.push(nextFirst);

        break;
      }

      // 2칸 띈 2 (OVVO)
      case 3: {
        // 낀 2개 위치 모두 추가
        result.push(first.move(direction.dx, direction.dy));
        result.push(first.move(direction.dx, direction.dy, 2));

        break;
      }

      default:
        break;
    }

    return result;
  }

  private findOpenTwos(position: Position) {
    return this.board
      .findConnectedStones(position, 'black', 2, { skip: 2 })
      .filter((target) => OmokAnalyzer.checkOpenTwo(this.board, target));
  }
}

export default SamsamRule;
