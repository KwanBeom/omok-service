import Board from '../Board';
import OmokAnalyzer from '../OmokAnalyzer';
import { IPosition, IPositionTuple, move } from '../../entities/Position';
import Positions from '../../entities/Positions';

type ThreeStonePositions = IPositionTuple<3>;

export type SasaGeumsuDatas = { position: IPosition; threeStones: ThreeStonePositions[] }[];

/** 렌주룰 4*4 금수 */
class SasaGeumsu {
  private board = new Board();

  private geumsu: SasaGeumsuDatas = [];

  private analyzer = new OmokAnalyzer(this.board);

  apply(board: Board, position: IPosition) {
    this.board = board;
    this.analyzer.update(board);

    const canSasaPositions = this.findCanSasaPositions(position);

    for (let i = 0; i < canSasaPositions.length; i += 1) {
      const threeStones = this.board.findConnectedStones(canSasaPositions[i], 'black', 3, {
        positionIsEmpty: true,
      });
      if (this.checkCanSasa(canSasaPositions[i], threeStones)) {
        this.geumsu.push({ position: canSasaPositions[i], threeStones });
      }
    }

    return this.geumsu;
  }

  haegeum(board: Board) {
    this.board = board;

    this.geumsu = this.geumsu.filter(({ position, threeStones }) => {
      const canFiveInARow = this.board.isNConnected(position, 'black', 5, {
        assumeStonePlaced: true,
      });
      if (canFiveInARow) return false;

      return this.checkCanSasa(position, threeStones);
    });

    return this.geumsu;
  }

  /** 4*4 금수 가능한 위치 찾기 */
  private findCanSasaPositions(position: IPosition): IPosition[] {
    const connectedThrees = this.board.findConnectedStones(position, 'black', 3, {
      skip: 2,
    });
    const result: IPosition[] = [];

    for (let i = 0; i < connectedThrees.length; i += 1) {
      const sortedPositions = this.sortPositions(connectedThrees[i]);
      const [first, last] = [sortedPositions[0], sortedPositions[2]];
      const distance = OmokAnalyzer.getDistance(first, last);
      const direction = OmokAnalyzer.getDirection(first, last);
      const reverse = direction.reverse();

      const [beforeFirst, twoBeforeFirst] = [move(first, reverse), move(first, reverse, 2)];
      const [afterLast, twoAfterLast] = [move(last, direction), move(last, direction, 2)];

      const canDropAfterTwoFirst =
        this.board.canDropStone(beforeFirst) && this.board.canDropStone(twoBeforeFirst);
      const canDropNextTwoLast =
        this.board.canDropStone(afterLast) && this.board.canDropStone(twoAfterLast);

      switch (distance) {
        // 3이 나란히 이어져 있는 경우, (OOO)
        case 2: {
          // 다음, 다다음 위치에 돌을 둘 수 있으면 금수 가능 위치
          if (canDropAfterTwoFirst) {
            result.push(beforeFirst);
            result.push(twoBeforeFirst);
          }

          if (canDropNextTwoLast) {
            result.push(afterLast);
            result.push(twoAfterLast);
          }

          break;
        }

        // 띈 3인 경우, (OVOO)
        case 3: {
          const bothSideEmpty = this.analyzer.bothSideEmpty(sortedPositions);

          if (bothSideEmpty) {
            // 양 사이가 비어있는 경우 띈 위치 추가
            let { x, y } = first;

            for (let j = 0; j < sortedPositions.length; j += 1) {
              if (!(sortedPositions[j].x === x && sortedPositions[j].y === y)) {
                result.push({ x, y });
                break;
              }

              x += direction.dx;
              y += direction.dy;
            }
          }

          // 다음, 다다음 위치가 비어있으면 다음 위치(띈 4) 추가
          if (canDropAfterTwoFirst) result.push(beforeFirst);
          if (canDropNextTwoLast) result.push(twoBeforeFirst);

          break;
        }

        // 2칸 띈 3인 경우, (OVVOO)
        case 4: {
          let { x, y } = first;
          const emptyPositions = [];

          // 띈 위치 추가
          for (let j = 0; j < sortedPositions.length; j += 1) {
            if (!(sortedPositions[j].x === x && sortedPositions[j].y === y)) {
              if (!this.board.canDropStone({ x, y })) break;

              emptyPositions.push({ x, y });
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
  private checkCanSasa(spot: IPosition, threeStones: ThreeStonePositions[]) {
    const { x, y } = spot;
    // 교점에 이어진 3이 2개 미만인 경우 금수 불가
    if (threeStones.length < 2) return false;
    if (!this.board.canDropStone({ x, y })) return false;

    /** spot이 간접 막혀있는지 확인 */
    const isIndirectlyBlocked = (stones: IPositionTuple<3>) => {
      const direction = OmokAnalyzer.getDirection(stones[0], spot);
      const indirectPosition = move(spot, direction);

      return this.board.get(indirectPosition)?.color === 'white';
    };

    const filteredThreeStones = threeStones.filter((threeStone) => {
      const fourStone: IPositionTuple<4> = [spot, ...threeStone];

      if (isIndirectlyBlocked(threeStone)) return false;

      return this.analyzer.checkFour(fourStone);
    });

    return filteredThreeStones.length >= 2;
  }

  private sortPositions<N extends IPosition[]>(positions: N): IPositionTuple<N['length']> {
    const position = new Positions(...positions);
    position.sort();

    return position.getAll();
  }
}

export default SasaGeumsu;
