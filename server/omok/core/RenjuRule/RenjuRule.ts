import Board from '../Board';
import {
  excludeTargetPositionArray,
  IPosition,
  IPositionTuple,
  move,
} from '../../entities/Position';
import PositionHelper from '../../entities/PositionHelper';
import JangmokRule from './JangmokRule';
import SamsamRule, { SamsamGeumsuDatas } from './SamsamRule';
import SasaRule from './SasaRule';
import OmokAnalyzer from '../OmokAnalyzer';
import Direction from '../../entities/Direction';
import { extractPositions } from '../../utils';

export type RenjuGeumsu = {
  sasa: IPosition[];
  samsam: IPosition[];
  jangmok: IPosition[];
};

// TODO: 거의 모든 거짓금수 테스트 케이스에 대해서 통과하였으나, 엣지 케이스가 존재해 추후 수정 필요
/** 렌주 룰 */
class RenjuRule {
  private rules = { samsam: new SamsamRule(), sasa: new SasaRule(), jangmok: new JangmokRule() };

  private geumsu: RenjuGeumsu = { samsam: [], sasa: [], jangmok: [] };

  private board: Board = new Board();

  private analyzer = new OmokAnalyzer(this.board);

  /** 룰 적용 */
  apply(board: Board, position: IPosition) {
    this.updateBoardAndAnalazyer(board);

    if (board.getStoneCount() < 6) return this.geumsu;

    const isBlackTurn = board.get(position)?.color === 'black';
    if (isBlackTurn) this.applyBlackRules(board, position);

    this.updateGeumsuAfterMove(board);
    return this.geumsu;
  }

  private updateBoardAndAnalazyer(board: Board) {
    this.board = board;
    this.analyzer.update(board);
  }

  private applyBlackRules(board: Board, position: IPosition) {
    this.geumsu.samsam = extractPositions(
      this.filterFakeSamsam(this.rules.samsam.apply(board, position)),
    );
    this.geumsu.sasa = extractPositions(this.rules.sasa.apply(board, position));
    this.geumsu.jangmok = this.rules.jangmok.apply(board, position);
  }

  private updateGeumsuAfterMove(board: Board) {
    this.geumsu.samsam = extractPositions(this.filterFakeSamsam(this.rules.samsam.haegeum(board)));
    this.geumsu.sasa = extractPositions(this.rules.sasa.haegeum(board));
    this.geumsu.jangmok = this.rules.jangmok.haegeum(board);
  }

  /** 거짓 금수 필터링 */
  private filterFakeSamsam(samsamGeumsuDatas: SamsamGeumsuDatas) {
    const filteredSamsamGeumsuData = samsamGeumsuDatas.filter(({ position, openTwoStones }) => {
      // 다음 금수 위치에 착수하고 다음 수순에 열린 4를 만들 수 없는 경우에 필터링
      const filteredOpenTwos = openTwoStones.filter((openTwo) => {
        // 다음 수순에 열린 4를 만들 수 없는 거짓 3인 경우 필터링
        if (this.checkFakeThree(position, openTwo)) return false;

        return true;
      });

      // 필터링 한 이후의 열린 2 갯수가 2개 이상인 경우에만 3*3 금수
      return filteredOpenTwos.length >= 2;
    });

    return filteredSamsamGeumsuData;
  }

  /** 금수 위치를 뒀을 때, 열린 4를 만들 수 없는 3인지 확인 */
  private checkFakeThree(geumsuSpot: IPosition, openTwo: IPositionTuple<2>) {
    const sortedThree = PositionHelper.sort([geumsuSpot, ...openTwo] as IPositionTuple<3>);
    const [first, last] = [sortedThree[0], sortedThree[2]];
    const threeStonesDistance = PositionHelper.getDistance(first, last);
    const direction = PositionHelper.getDirection(first, last);
    const skipPosition = PositionHelper.getSkippedPosition(sortedThree);
    /** skipPosition 기준 열린 2들 */
    const openTwosToSkipPosition = excludeTargetPositionArray(
      this.findOpenTwos(skipPosition),
      openTwo,
    );

    if (this.canMakeFourInRow(geumsuSpot, direction)) return true;

    // 금수 위치와 열린 2를 합해 이은 3인 경우, 다음 수순에 금수라면 열린 4를 만들 수 없음
    if (threeStonesDistance === 2) {
      return this.nextStepIsGeumsu(sortedThree, { excludedTwo: openTwo });
    }

    // 금수 위치와 열린 2를 합해 띈 3인 경우
    if (threeStonesDistance === 3) {
      // OOVO 사이 낀 위치가 4*4 금수가 되는 경우 열린 4 불가능
      if (this.canMakeFour(skipPosition)) return true;

      // 띈 위치가 3*3 금수인 경우
      // 건너뛴 위치에 열린 2들 중 다음 수순에 열린 4가 가능한 열린 2가 2개 이상인 경우 다음 수순에 열린 4를 만들 수 없기 때문에 거짓 3
      if (openTwosToSkipPosition.length >= 2) {
        // 건너뛴 위치 열린 2들 중, 금수 위치에 착수하고 다음 수순에 열린 4가 가능한 열린 2
        const canMakeFourOpenTwosToSkipPosition = openTwosToSkipPosition.filter(
          (openTwoToSkipPosition) => {
            const three: IPositionTuple<3> = [skipPosition, ...openTwoToSkipPosition];

            // 다음 수순에 금수인 경우 열린 4를 만들 수 없음
            if (this.nextStepIsGeumsu(three, { excludedTwo: openTwoToSkipPosition })) return false;

            return true;
          },
        );

        // 띈 위치에 3*3 금수를 구성하는 열린 2들 중 다음 수순에 열린 4를 만들 수 있는 열린 2가 2개 이상인 경우 거짓 2
        if (canMakeFourOpenTwosToSkipPosition.length >= 2) return true;
      }
    }

    return false;
  }

  /** 3이 다음 수순에 금수인지 확인, 즉 열린 4를 다음 수순에 만들 수 없는지 확인 */
  private nextStepIsGeumsu(
    three: IPositionTuple<3>,
    options?: { excludedTwo?: IPositionTuple<2> },
  ) {
    const sortedThree = PositionHelper.sort(three);
    const distance = PositionHelper.getDistance(sortedThree[0], sortedThree[2]);
    const skipPosition = PositionHelper.getSkippedPosition(sortedThree);
    const [first, last] = [sortedThree[0], sortedThree[2]];
    const direction = PositionHelper.getDirection(first, last);
    const reverse = Direction.reverse(direction);
    const [beforeFirst, afterLast] = [move(first, reverse), move(last, direction)];
    const [twoBeforeFirst, twoAfterLast] = [move(first, reverse, 2), move(last, direction, 2)];

    // OOO
    if (distance === 2) {
      // 1. 양쪽 모두 금수인 경우 열린 4 불가능
      if (
        this.checkBothSideGeumsu(beforeFirst, afterLast, sortedThree, {
          excludedTwo: options?.excludedTwo,
        })
      ) {
        return true;
      }

      // 2. 이은 3에, 한 쪽은 간접 막혀있고, 열려있는 방향이 4*4 금수 또는 6목이 되는 경우 열린 4 불가능
      if (
        (this.isBlocked(twoBeforeFirst) && this.checkOpenSideGeumsu(afterLast, sortedThree)) ||
        (this.isBlocked(twoAfterLast) && this.checkOpenSideGeumsu(beforeFirst, sortedThree))
      ) {
        return true;
      }
    }

    // OVOO, 띈 위치가 4*4 금수, 장목 금수인지 확인
    if (distance === 3) {
      return this.canMakeFour(skipPosition) || this.checkJangmok([...sortedThree, skipPosition]);
    }

    return false;
  }

  /** position에 돌을 놓아 direction에 4가 만들어지는지 */
  private canMakeFourInRow(position: IPosition, direction: Direction) {
    return (
      this.board.countStonesInBothDirections(position, direction, 'black', {
        assumeStonePlaced: true,
        skip: true,
      }) === 4
    );
  }

  /** 양쪽 모두 금수인지 확인. 단, 양쪽이 모두 3*3 금수인 경우는 제외 */
  private checkBothSideGeumsu(
    sideA: IPosition,
    sideB: IPosition,
    three: IPositionTuple<3>,
    options?: { excludedTwo?: IPositionTuple<2> },
  ) {
    const sortedThree = PositionHelper.sort(three);
    const sideASasa = this.canMakeFour(sideA);
    const sideBSasa = this.canMakeFour(sideB);
    const sideBJangmok = this.checkJangmok([sideB, ...sortedThree]);
    const sideAJangmok = this.checkJangmok([sideA, ...sortedThree]);
    const sideASamsam = this.checkSamsam(sideA, options?.excludedTwo);
    const sideBSamsam = this.checkSamsam(sideB, options?.excludedTwo);

    if (sideASasa) return sideBJangmok || sideBSamsam || sideBSasa;
    if (sideBSasa) return sideAJangmok || sideASamsam || sideASasa;

    if (sideAJangmok) return sideBSamsam || sideBSasa;
    if (sideBJangmok) return sideASamsam || sideASasa;

    if (sideASamsam) return sideBJangmok || sideBSasa;
    if (sideBSamsam) return sideAJangmok || sideASasa;

    return false;
  }

  /** 열려있는 방향이 장목 혹은 44 금수인지 확인 */
  private checkOpenSideGeumsu(openSide: IPosition, three: IPositionTuple<3>) {
    return this.checkJangmok([openSide, ...three]) || this.canMakeFour(openSide);
  }

  /** position이 3*3 금수 위치인지 확인 */
  private checkSamsam(position: IPosition, excludedTwo?: IPositionTuple<2>) {
    const openTwos = this.findOpenTwos(position);

    if (excludedTwo) return excludeTargetPositionArray(openTwos, excludedTwo).length >= 2;

    return openTwos.length >= 2;
  }

  /** 4가 장목 금수 조건에 부합하는지 */
  private checkJangmok(four: IPositionTuple<4>) {
    const sortedFour = PositionHelper.sort(four);

    // 띈 위치에 연결된 돌이 있는 경우 장목 금수
    return this.analyzer.hasGapConnection(sortedFour);
  }

  /** 해당 위치가 보드 끝이거나 흰돌로 막혀있는 위치인지 */
  private isBlocked(position: IPosition) {
    return !this.board.canDropStone(position);
  }

  /** 해당 위치에 돌을 놓으면 4가 만들어지는지 */
  private canMakeFour(position: IPosition) {
    return this.board.isNConnected(position, 'black', 4, { assumeStonePlaced: true });
  }

  /** position 기준 열린 2 찾기 */
  private findOpenTwos(position: IPosition) {
    return this.board
      .findConnectedStones(position, 'black', 2, { positionIsEmpty: true, skip: 1 })
      .filter((target) => this.analyzer.checkOpenTwo(target));
  }
}

export default RenjuRule;
