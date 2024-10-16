import Board from '../Board';
import OmokAnalyzer from '../OmokAnalyzer';
import { IPosition, isSamePosition } from '../../entities/Position';
import Positions from '../../entities/Positions';
import JangmokRule from './JangmokRule';
import SamsamRule, { SamsamGeumsuDatas } from './SamsamRule';
import SasaRule from './SasaRule';

export type RenjuGeumsu = {
  sasa: IPosition[];
  samsam: IPosition[];
  jangmok: IPosition[];
};

/** 렌주 룰 */
class RenjuRule {
  private rules = { samsam: new SamsamRule(), sasa: new SasaRule(), jangmok: new JangmokRule() };

  private geumsu: RenjuGeumsu = { samsam: [], sasa: [], jangmok: [] };

  private board: Board = new Board();

  /** 룰 적용 */
  apply(board: Board, position: IPosition) {
    this.board = board;

    const count = board.getStoneCount();
    const isBlackTurn = board.get(position)?.color === 'black';

    if (count < 6) return this.geumsu;

    // this.board.view();

    if (isBlackTurn) {
      const samsam = this.rules.samsam.apply(board, position);
      // console.log(samsam);
      this.geumsu.samsam = this.extractPositions(this.filterFakeGeumsu(samsam));
      this.geumsu.sasa = this.extractPositions(this.rules.sasa.apply(board, position));
      this.geumsu.jangmok = this.rules.jangmok.apply(board, position);
    }

    const samsam = this.rules.samsam.haegeum(board);
    this.geumsu.samsam = this.extractPositions(this.filterFakeGeumsu(samsam));
    this.geumsu.sasa = this.extractPositions(this.rules.sasa.haegeum(board));
    this.geumsu.jangmok = this.rules.jangmok.haegeum(board);

    return this.geumsu;
  }

  // 다음 수순으로 진행하고,

  /** 거짓 금수 필터링 */
  private filterFakeGeumsu(samsamGeumsuDatas: SamsamGeumsuDatas) {
    return samsamGeumsuDatas;

    const canMakeFour = (position: IPosition) =>
      this.board.isNConnected(position, 'black', 5, { assumeStonePlaced: true });

    // 3*3을 이루는 2가 3개 이상인 금수 위치
    const overTwoOpenTwoStonesSamsamDatas: SamsamGeumsuDatas = [];

    for (let i = 0; i < samsamGeumsuDatas.length; i += 1) {
      const { openTwoStones } = samsamGeumsuDatas[i];

      // 띈 2인(OVVO) 경우 추가 검증, 금수 위치를 제외한 띈 위치가 4를 만들어 금수 위치를 해금할 수 있는지 경우
      // openTwo 조건에 부합하지 않음..
      const filteredOpenTwoStones = openTwoStones.filter((openTwoStone) => {
        const distance = OmokAnalyzer.getDistance(...openTwoStone);

        if (distance === 3) {
          const skipPosition = Positions.getSkippedPosition(openTwoStone);

          if (skipPosition) return !canMakeFour(skipPosition);
        }

        return true;
      });

      if (filteredOpenTwoStones.length >= 3) {
        overTwoOpenTwoStonesSamsamDatas.push(samsamGeumsuDatas[i]);
      }
    }

    // 거짓 2 필터링 데이터
    const filteredSamsamGeumsuData = samsamGeumsuDatas.filter(({ position, openTwoStones }) => {
      const filteredOpenTwos = openTwoStones.filter((openTwo) => {
        const sortedOpenTwo = new Positions(...openTwo).sort();
        const threePositions = new Positions(position, ...openTwo).sort();
        const sortedThree = threePositions.getAll();
        const distance = OmokAnalyzer.getDistance(...openTwo);
        const threeStoneDistance = OmokAnalyzer.getDistance(sortedThree[0], sortedThree[2]);

        // 3*3 금수 위치가 4를 만들어서 해금할 수 있는 경우

        // OO인 경우
        if (distance === 1) {
          // 금수 위치까지 OOO이면 거짓 3 조건 X
          if (threeStoneDistance === 2) return true;
          if (threeStoneDistance === 3) {
            const skipPosition = Positions.getSkippedPosition(sortedThree);

            // OOVO 사이 V가 3*3 금수를 만드는 2의 갯수가 3개 이상인 경우, 현재 2로 3을 만들어도 해금되지 않음
            if (
              skipPosition &&
              overTwoOpenTwoStonesSamsamDatas.some(({ position: pos }) =>
                new Position(pos.x, pos.y).isSame(skipPosition),
              )
            )
              return false;
            // OOVO 사이 V가 다음 수순에 4*4가 되는 경우 거짓 금수 조건에 성립함
            if (
              skipPosition &&
              this.board.isNConnected(skipPosition, 'black', 4, {
                assumeStonePlaced: true,
              })
            )
              return false;
          }
        }

        // OVO인 경우 V 위치에 3*3 금수를 만드는 2의 갯수가 3개 이상인 경우, 현재 2가 3을 만들더라도 해금되지 않기 때문에 거짓 2
        if (distance === 2) {
          const skipPosition = Positions.getSkippedPosition(openTwo);

          if (
            skipPosition &&
            overTwoOpenTwoStonesSamsamDatas.some(({ position: pos }) =>
              new Position(pos.x, pos.y).isSame(skipPosition),
            )
          )
            return false;
        }

        // OVVO인 경우 금수 위치를 제외한 V 위치에 3*3 금수를 만드는 2의 갯수가 3개 이상인 경우, 현재 2가 3을 만들더라도 해금되지 않기 때문에 거짓 2
        if (distance === 3) {
          const skipPosition = Positions.getSkippedPosition(sortedThree);

          if (
            skipPosition &&
            overTwoOpenTwoStonesSamsamDatas.some(({ position: pos }) =>
              new Position(pos.x, pos.y).isSame(skipPosition),
            )
          )
            return false;
        }

        // if (this.isFakeThree(position, openTwo)) return false;

        return true;
      });

      // 열린 2의 수가 2개 이상인지 확인, 미만인 경우 거짓 금수
      return filteredOpenTwos.length >= 2;
    });

    return filteredSamsamGeumsuData;
  }

  // private isFakeThree(spot: IPosition, openTwo: PositionTuple<2>) {
  //   const positions = new Positions(spot, ...openTwo);
  //   positions.sort();
  //   const sortedPositions = positions.getAll();
  //   const [first, third] = [sortedPositions[0], sortedPositions[sortedPositions.length - 1]];
  //   const direction = Positions.getDirection(first, third);
  //   const reverse = direction.reverse();
  //   const [beforeFirst, nextThird] = [
  //     first.move(reverse.dx, reverse.dy),
  //     third.move(direction.dx, direction.dy),
  //   ];
  //   const openTwoDistance = Positions.getDistance(...openTwo);
  //   const distance = Positions.getDistance(sortedPositions[0], sortedPositions[2]);
  // }

  private isGeumsu(position: IPosition) {
    return (
      this.isSasaGeumsu(position) || this.isJangmokGeumsu(position) || this.isSamsamGeumsu(position)
    );
  }

  private isSasaGeumsu(position: IPosition) {
    return this.geumsu.sasa.some((geumsu) => isSamePosition(geumsu, position));
  }

  private isJangmokGeumsu(position: IPosition) {
    return this.geumsu.jangmok.some((geumsu) => isSamePosition(geumsu, position));
  }

  private isSamsamGeumsu(position: IPosition) {
    return this.geumsu.samsam.some((geumsu) => isSamePosition(geumsu, position));
  }

  private extractPositions(data: { position: IPosition }[]) {
    return data.map(({ position }) => position);
  }
}

export default RenjuRule;
