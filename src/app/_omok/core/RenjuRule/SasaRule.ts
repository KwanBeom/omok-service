import Board from '../Board';
import OmokAnalyzer from '../OmokAnalyzer';
import {
  deserializePosition,
  IPosition,
  IPositionTuple,
  move,
  serializePosition,
} from '../../entities/Position';
import PositionHelper from '../../entities/PositionHelper';

type ThreeStonePositions = IPositionTuple<3>;

export type SasaGeumsuDatas = { position: IPosition; threeStones: ThreeStonePositions[] }[];

/** 렌주룰 4*4 금수 */
class SasaRule {
  private board = new Board();

  private geumsu = new Map<string, ThreeStonePositions[]>();

  private analyzer = new OmokAnalyzer(this.board);

  apply(board: Board, position: IPosition): SasaGeumsuDatas {
    this.board = board;
    this.analyzer.update(board);

    const canSasaPositions = this.findCanSasaPositions(position);

    for (let i = 0; i < canSasaPositions.length; i += 1) {
      const canSasaPosition = canSasaPositions[i];

      const threeStones = this.board.findConnectedStones(canSasaPosition, 'black', 3, {
        positionIsEmpty: true,
      });

      const positionKey = serializePosition(canSasaPosition);

      if (this.checkCanSasa(canSasaPosition, threeStones)) {
        const isExistGeumsuPosition = this.geumsu.has(positionKey);
        const existOpenThrees = this.geumsu.get(positionKey);

        this.geumsu.set(
          positionKey,
          isExistGeumsuPosition
            ? PositionHelper.removeDuplicatePositionArray([...existOpenThrees!, ...threeStones])
            : threeStones,
        );
      }
    }

    return [...this.geumsu].map(([key, value]) => ({
      position: deserializePosition(key),
      threeStones: value,
    }));
  }

  haegeum(board: Board): SasaGeumsuDatas {
    this.board = board;

    this.geumsu.forEach((threeStones, positionKey) => {
      const position = deserializePosition(positionKey);

      const canFiveInARow = this.board.isNConnected(position, 'black', 5, {
        assumeStonePlaced: true,
      });

      if (canFiveInARow) {
        this.geumsu.delete(positionKey);
        return;
      }

      if (!this.checkCanSasa(position, threeStones)) this.geumsu.delete(positionKey);
    });

    return [...this.geumsu].map(([key, value]) => ({
      position: deserializePosition(key),
      threeStones: value,
    }));
  }

  /** 4*4 금수 가능한 위치 찾기 */
  private findCanSasaPositions(position: IPosition): IPosition[] {
    const connectedThrees = this.board.findConnectedStones(position, 'black', 3, {
      skip: 2,
    });
    const result: IPosition[] = [];

    for (let i = 0; i < connectedThrees.length; i += 1) {
      const sortedPositions = PositionHelper.sort(connectedThrees[i]);
      const [first, last] = [sortedPositions[0], sortedPositions[2]];
      const distance = PositionHelper.getDistance(first, last);
      const direction = PositionHelper.getDirection(first, last);
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
          const hasOpenSide = this.analyzer.hasOpenSide(sortedPositions);
          // 한 방향이라도 열려있으면
          if (hasOpenSide) {
            // 띈 위치 추가
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

        // 2칸 띈 3인 경우, (OVVOO, OVOVO)
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

    const filteredThreeStones = threeStones.filter((threeStone) => {
      if (threeStone.some((position) => this.board.get(position) === Board.EMPTY)) return false;
      const fourStone: IPositionTuple<4> = [spot, ...threeStone];

      return this.analyzer.checkFour(fourStone);
    });

    return filteredThreeStones.length >= 2;
  }
}

export default SasaRule;
