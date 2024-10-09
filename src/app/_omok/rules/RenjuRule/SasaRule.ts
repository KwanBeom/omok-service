import Board from "../../core/Board";
import OmokAnalyzer from "../../core/OmokAnalyzer";
import Position, { Positions, sortPositions } from "../../entities/Position";


type ThreeStonePositions = Positions<3>;

export type SasaGeumsuDatas = { position: Position; threeStones: ThreeStonePositions[] }[];

/** 렌주룰 4*4 금수 */
class SasaGeumsu {
  private board = new Board();

  private geumsuDatas: SasaGeumsuDatas = [];

  apply(board: Board, position: Position) {
    this.board = board;

    const canSasaPositions = this.findCanSasaPositions(position);

    for (let i = 0; i < canSasaPositions.length; i += 1) {
      const threeStones = this.board.findConnectedStones(canSasaPositions[i], 'black', 3, {
        positionIsEmpty: true,
      });

      if (this.checkCanSasa(canSasaPositions[i], threeStones)) {
        this.geumsuDatas.push({ position: canSasaPositions[i], threeStones });
      }
    }

    return this.geumsuDatas.map((data) => data.position);
  }

  haegeum(board: Board) {
    this.board = board;

    this.geumsuDatas = this.geumsuDatas.filter(({ position, threeStones }) => {
      const canFiveInARow = this.board.isNConnected(position, 'black', 5, {
        assumeStonePlaced: true,
      });

      if (canFiveInARow) return false;

      return this.checkCanSasa(position, threeStones);
    });

    return this.geumsuDatas.map((data) => data.position);
  }

  /** 4*4 금수 가능한 위치 찾기 */
  private findCanSasaPositions(position: Position): Position[] {
    const connectedThrees = this.board.findConnectedStones(position, 'black', 3, {
      skip: 2,
    });
    const result: Position[] = [];

    for (let i = 0; i < connectedThrees.length; i += 1) {
      const sortedPositions = sortPositions(connectedThrees[i]);
      const first = sortedPositions[0];
      const last = sortedPositions[2];
      const distance = OmokAnalyzer.getDistance(first, last);
      const direction = OmokAnalyzer.getDirection(first, last);
      const reverse = direction.reverse();

      const nextFirst = first.move(reverse.dx, reverse.dy);
      const afterNextFirst = first.move(reverse.dx, reverse.dy, 2);
      const nextLast = last.move(direction.dx, direction.dy);
      const afterNextLast = last.move(direction.dx, direction.dy, 2);

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
            let { x, y } = first;

            for (let j = 0; j < sortedPositions.length; j += 1) {
              if (!(sortedPositions[j].x === x && sortedPositions[j].y === y)) {
                result.push(new Position(x, y));
                break;
              }

              x += direction.dx;
              y += direction.dy;
            }
          }

          // 다음, 다다음 위치가 비어있으면 다음 위치(띈 4) 추가
          if (canDropNextTwoFirstStone) result.push(nextFirst);
          if (canDropNextTwoLastStone) result.push(nextLast);

          break;
        }

        // 2칸 띈 3인 경우, (OVVOO)
        case 4: {
          let { x, y } = first;
          const emptyPositions = [];

          // 띈 위치 추가
          for (let j = 0; j < sortedPositions.length; j += 1) {
            if (!(sortedPositions[j].x === x && sortedPositions[j].y === y)) {
              const currentPosition = new Position(x, y);
              if (!this.board.canDropStone(currentPosition)) break;

              emptyPositions.push(currentPosition);
              j -= 1;
            }

            x += direction.dx;
            y += direction.dy;
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
      const { dx, dy } = OmokAnalyzer.getDirection(stones[0], spot);
      const indirectPosition = spot.move(dx, dy);

      return this.board.get(indirectPosition)?.color === 'white';
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
