import Board from '../Board';
import OmokAnalyzer from '../OmokAnalyzer';
import { STONE } from '../Stone';
import { createPosition, Position, Positions, sortPositions } from '../utils';

type ThreeStonePositions = Positions<3>;

/** 렌주룰 4*4 금수 */
class SasaGeumsu {
  private board = new Board();

  private geumsu: { position: Position; threeStones: ThreeStonePositions[] }[] = [];

  check(board: Board, position: Position) {
    this.board = board;

    const connectedThrees = this.board.findConnectedStones(position, STONE.BLACK.POINT, 3);

    return this.checkCanSasa(position, connectedThrees);
  }

  apply(board: Board, position: Position) {
    this.board = board;

    const canSasaPositions = this.findCanSasaPositions(position);

    for (let i = 0; i < canSasaPositions.length; i += 1) {
      const threeStones = this.board.findConnectedStones(
        canSasaPositions[i],
        STONE.BLACK.POINT,
        3,
        { positionIsEmpty: true },
      );

      if (this.checkCanSasa(canSasaPositions[i], threeStones)) {
        this.geumsu.push({ position: canSasaPositions[i], threeStones });
      }
    }

    return this.geumsu.map((data) => data.position);
  }

  haegeum(board: Board) {
    this.board = board;

    this.geumsu = this.geumsu.filter(({ position, threeStones }) => {
      const canFiveInARow = this.board.isNConnected(position, STONE.BLACK.POINT, 3, {
        assumeStonePlaced: true,
      });
      if (canFiveInARow) return false;

      return this.checkCanSasa(position, threeStones);
    });

    return this.geumsu.map((data) => data.position);
  }

  /** 4*4 금수 가능한 위치 찾기 */
  private findCanSasaPositions(position: Position): Position[] {
    const connectedThrees = this.board.findConnectedStones(position, STONE.BLACK.POINT, 3, {
      skip: 2,
    });
    const result: Position[] = [];

    for (let i = 0; i < connectedThrees.length; i += 1) {
      const sortedPositions = sortPositions(connectedThrees[i]);
      const firstStone = sortedPositions[0];
      const lastStone = sortedPositions[2];
      const distance = OmokAnalyzer.getDistance(firstStone, lastStone);
      const { dx, dy } = OmokAnalyzer.getDirection(firstStone, lastStone);

      const nextFirst = createPosition(firstStone.x + -dx, firstStone.y + -dy);
      const nextLast = createPosition(lastStone.x + dx, lastStone.y + dy);
      const afterNextFirst = createPosition(firstStone.x + -dx * 2, firstStone.y + -dy * 2);
      const afterNextLast = createPosition(lastStone.x + dx * 2, lastStone.y + dy * 2);

      const canDropNextTwoFirstStone =
        this.board.canDropStone(nextFirst) && this.board.canDropStone(afterNextFirst);
      const canDropNextTwoLastStone =
        this.board.canDropStone(nextLast) && this.board.canDropStone(afterNextLast);

      switch (distance) {
        // 3이 나란히 이어져 있는 경우, (OOO)
        case 2: {
          // 다음, 다다음 위치에 돌을 둘 수 있으면 금수 가능 위치
          if (canDropNextTwoFirstStone) {
            result.push(afterNextFirst);
            result.push(nextFirst);
          }

          if (canDropNextTwoLastStone) {
            result.push(afterNextLast);
            result.push(nextLast);
          }

          break;
        }

        // 띈 3인 경우, (OVOO)
        case 3: {
          const bothSideEmpty =
            this.board.canDropStone(nextFirst) && this.board.canDropStone(nextLast);

          if (bothSideEmpty) {
            // 양 사이가 비어있는 경우 띈 위치 추가
            let { x, y } = firstStone;

            for (let j = 0; j < sortedPositions.length; j += 1) {
              if (!(sortedPositions[j].x === x && sortedPositions[j].y === y)) {
                result.push(createPosition(x, y));
                break;
              }

              x += dx;
              y += dy;
            }
          }

          // 다음, 다다음 위치가 비어있으면 다음 위치(띈 4) 추가
          if (canDropNextTwoFirstStone) result.push(nextFirst);
          if (canDropNextTwoLastStone) result.push(nextLast);

          break;
        }

        // 2칸 띈 3인 경우, (OVVOO)
        case 4: {
          let { x, y } = firstStone;
          const emptyPositions = [];

          // 띈 위치 추가
          for (let j = 0; j < sortedPositions.length; j += 1) {
            if (!(sortedPositions[j].x === x && sortedPositions[j].y === y)) {
              const currentPosition = createPosition(x, y);
              if (!this.board.canDropStone(currentPosition)) break;

              emptyPositions.push(currentPosition);
              j -= 1;
            }

            x += dx;
            y += dy;
          }

          if (emptyPositions.length === 2) {
            result.push(...emptyPositions);
          }

          break;
        }

        default:
          break;
      }
    }

    return result;
  }

  /** spot 위치가 4*4 금수 가능 위치인지 확인 */
  private checkCanSasa(spot: Position, threeStones: ThreeStonePositions[]) {
    // 교점에 이어진 3이 2개 미만인 경우 금수 불가
    if (threeStones.length < 2) return false;
    if (!this.board.canDropStone(spot)) return false;

    /** spot이 간접 막혀있는지 확인 */
    const isIndirectlyBlocked = (stones: Positions<3>) => {
      const { x, y } = spot;
      const { dx, dy } = OmokAnalyzer.getDirection(stones[0], spot);
      const indirectPosition = createPosition(x + dx, y + dy);

      return this.board.get(indirectPosition) === STONE.WHITE.POINT;
    };

    const filteredThreeStones = threeStones.filter((threeStone) => {
      const fourStone: Positions<4> = [spot, ...threeStone];

      if (isIndirectlyBlocked(threeStone)) return false;

      return OmokAnalyzer.checkFour(this.board, fourStone);
    });

    return filteredThreeStones.length >= 2;
  }
}

export default SasaGeumsu;
