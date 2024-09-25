import Board, { EMPTY } from './Board';
import { DIRECTIONS } from './constants';
import { STONE } from './Stone';
import {
  createDirection,
  createPosition,
  Direction,
  getDistance,
  getStonePointByCount,
  Position,
  sortPositions,
} from './utils';

type OpenTwo = [Position, Position];

export type RenjuGeumsu = {
  samsam: { position: Position; openTwoPositions: OpenTwo[] }[];
  sasa: Position[];
  jangmok: Position[];
};

class RenjuRule {
  private position: Position = { x: 0, y: 0 };

  private board: Board;

  private geumsu: RenjuGeumsu = {
    samsam: [],
    sasa: [],
    jangmok: [],
  };

  constructor() {
    this.board = new Board();
  }

  /** 금수 위치 반환 */
  getGeumsu(): {
    samsam: Position[];
    sasa: Position[];
    jangmok: Position[];
  } {
    const samsam: Position[] = this.geumsu.samsam.map((data) => data.position);

    return { ...this.geumsu, samsam };
  }

  /** 룰 적용 */
  apply(board: Board, position: Position, count: number) {
    this.position = position;
    this.board = board;

    const isBlackTurn = getStonePointByCount(count) === STONE.BLACK.POINT;

    if (count >= 6) {
      this.haegeum();

      if (isBlackTurn) {
        this.jangmok();
        this.samsam();
      }
    }
  }

  private samsam() {
    const { x, y } = this.position;

    /** open two인지 체크 */
    const checkOpenTwo = (position1: Position, position2: Position) => {
      const { dx, dy } = Board.getDirection(position1, position2);
      const distance = getDistance(position1, position2);

      const bothSideEmpty =
        this.board.canDropStone(createPosition(position1.x + -dx, position1.y + -dy)) &&
        this.board.canDropStone(createPosition(position2.x + dx, position2.y + dy));

      if (bothSideEmpty) {
        if (distance === 1) return true;

        const innerFirstPosition = createPosition(position1.x + dx, position1.y + dy);

        if (distance === 2) return this.board.canDropStone(innerFirstPosition);

        const innerSecondPosition = createPosition(position1.x + dx * 2, position1.y + dy * 2);

        if (distance === 3) {
          return (
            this.board.canDropStone(innerFirstPosition) &&
            this.board.canDropStone(innerSecondPosition)
          );
        }
      }

      return false;
    };

    /** 열린 2 찾기 */
    const findOpenTwo = (position: Position): OpenTwo[] => {
      const result: ReturnType<typeof findOpenTwo> = [];
      const cachedPosition = new Set();

      const positionToCacheData = (p1: Position, p2: Position) => `${p1.x}.${p1.y}-${p2.x}.${p2.y}`;

      const isPositionCached = (p1: Position, p2: Position) =>
        cachedPosition.has(positionToCacheData(p1, p2));

      const cachePosition = (p1: Position, p2: Position) => {
        // 정방향, 역방향 위치 캐싱
        cachedPosition.add(positionToCacheData(p1, p2));
        cachedPosition.add(positionToCacheData(p2, p1));
      };

      // 흑돌 연결된 2 위치 찾기
      const find = (p: Position, d: Direction): [Position, Position] | undefined => {
        let { x: cx, y: cy } = p;
        const { dx, dy } = d;
        let skipCount = 0;
        let count = 0;
        let startPosition = { x: 0, y: 0 };
        const opossiteFirstPosition = createPosition(cx + -dx, cy + -dy);

        // 반대 방향의 첫번째 돌이 흑돌, 현재 위치가 비어있는 경우
        if (
          Board.isValidStonePosition(opossiteFirstPosition) &&
          this.board.get(opossiteFirstPosition) === STONE.BLACK.POINT &&
          this.board.get(createPosition(cx, cy)) === EMPTY
        ) {
          startPosition = opossiteFirstPosition;
          count += 1;
        }

        while (Board.isValidStonePosition(createPosition(cx, cy))) {
          const target = this.board.get(createPosition(cx, cy));

          // 종료 조건
          if (target === STONE.WHITE.POINT) break;
          if (target === EMPTY && skipCount >= 3) break;

          if (target === STONE.BLACK.POINT) {
            if (count === 0) startPosition = createPosition(cx, cy);

            count += 1;
          }

          if (count === 2) {
            const openTwoPosition: [Position, Position] = [startPosition, createPosition(cx, cy)];
            // 캐싱된 경우 중복 처리 방지
            if (isPositionCached(...openTwoPosition)) {
              return undefined;
            }
            // 캐싱되지 않은 경우 캐싱하고 위치 반환
            cachePosition(...openTwoPosition);

            return openTwoPosition;
          }

          if (target === EMPTY) skipCount += 1;

          cx += dx;
          cy += dy;
        }

        return undefined;
      };

      for (let i = 0; i < DIRECTIONS.length; i += 1) {
        const twoPosition = find(position, DIRECTIONS[i]);

        if (twoPosition && checkOpenTwo(...twoPosition)) {
          result.push(twoPosition);
        }
      }

      return result;
    };

    /** 3*3 금수 가능한 위치 찾기 */
    const findCanSamsamPosition = (openTwoPosition: OpenTwo): Position[] => {
      const result: Position[] = [];
      const [currentPosition, openTwoSpot] = openTwoPosition;
      const { x: tx, y: ty } = openTwoSpot;
      // 놓여진 돌 기준, 기존에 있는 돌 위치로 향하는 방향
      const { dx, dy } = Board.getDirection(currentPosition, openTwoSpot);
      const distance = getDistance(currentPosition, openTwoSpot);

      const nextOpenTwo = createPosition(tx + dx, ty + dy);
      const nextCurrentStone = createPosition(x + -dx, y + -dy);
      const afterNextOpenTwo = createPosition(tx + dx * 2, ty + dy * 2);
      const afterNextCurrentStone = createPosition(x + -dx * 2, y + -dy * 2);

      const checkOpenThreeWithPosition = (position: Position) =>
        this.board.canDropStone(position) &&
        this.checkOpenThree([currentPosition, openTwoSpot, position]);

      switch (distance) {
        // 붙은 2 (OO)
        case 1: {
          // 이은 3 위치가 열린 3인지 확인 후 3*3 가능 위치 추가
          if (checkOpenThreeWithPosition(nextOpenTwo)) result.push(nextOpenTwo);
          if (checkOpenThreeWithPosition(nextCurrentStone)) result.push(nextCurrentStone);
          // 띈 3 위치가 열린 3인지 확인 후 3*3 가능 위치 추가
          if (checkOpenThreeWithPosition(afterNextOpenTwo)) result.push(afterNextOpenTwo);
          if (checkOpenThreeWithPosition(afterNextCurrentStone)) result.push(afterNextCurrentStone);

          break;
        }

        // 1칸 띈 2 (OVO)
        case 2: {
          // 띈 2 사이 낀 위치 3*3 가능 위치 추가
          result.push(createPosition(x + dx, y + dy));

          if (checkOpenThreeWithPosition(nextOpenTwo)) result.push(nextOpenTwo);
          if (checkOpenThreeWithPosition(nextCurrentStone)) result.push(nextCurrentStone);

          break;
        }

        // 2칸 띈 2 (OVVO)
        case 3: {
          // 낀 2개 위치 모두 추가
          result.push(createPosition(x + dx, y + dy));
          result.push(createPosition(x + dx * 2, y + dy * 2));

          break;
        }

        default:
          break;
      }

      return result;
    };

    const openTwos = findOpenTwo(this.position);

    for (let i = 0; i < openTwos.length; i += 1) {
      const canSamsamPositions = findCanSamsamPosition(openTwos[i]);

      for (let j = 0; j < canSamsamPositions.length; j += 1) {
        // 3*3 가능 자리 기준 open two 탐색
        const potentialOpenTwos = findOpenTwo(canSamsamPositions[j]);

        // 3*3 가능 자리에 open two 2개 이상인 경우
        if (potentialOpenTwos.length >= 2) {
          if (this.checkCanSamsam(canSamsamPositions[j], potentialOpenTwos)) {
            this.geumsu.samsam.push({
              position: canSamsamPositions[j],
              openTwoPositions: potentialOpenTwos,
            });
          }
        }
      }
    }
  }

  /** 해금 */
  private haegeum() {
    this.geumsu.samsam = this.geumsu.samsam.filter(({ position, openTwoPositions }) =>
      this.checkCanSamsam(position, openTwoPositions),
    );
  }

  /** open two들로 spot 위치가 3*3이 되는지 확인 */
  private checkCanSamsam(spot: Position, openTwos: OpenTwo[]) {
    // 열린 2는 여러개 가능
    const filteredOpenTwos = openTwos.filter((openTwo) => {
      const sortedPositions = sortPositions([spot, ...openTwo]);
      const last = sortedPositions.length - 1;

      const { dx, dy } = Board.getDirection(sortedPositions[0], sortedPositions[last]);
      const beforeFirstStone = createPosition(
        sortedPositions[0].x + -dx,
        sortedPositions[last].y + -dy,
      );
      const afterLastStone = createPosition(
        sortedPositions[last].x + dx,
        sortedPositions[last].y + dy,
      );

      // 열린 3이고 다음 수순에 열린 4를 만들 수 있는지 확인
      return (
        this.checkOpenThree([spot, ...openTwo]) &&
        (this.checkOpenFour([spot, ...openTwo, beforeFirstStone]) ||
          this.checkOpenFour([spot, ...openTwo, afterLastStone]))
      );
    });

    // 교점에 3*3을 만들 수 있는 조건에 부합하는 돌들이 둘 이상인지 확인
    return filteredOpenTwos.length >= 2;
  }

  /** open three인지 확인 */
  private checkOpenThree(positions: [Position, Position, Position]) {
    const isHaveWhite = positions.some(
      (position) => this.board.get(position) === STONE.WHITE.POINT,
    );

    if (isHaveWhite) return false;

    const sortedPositions = sortPositions(positions);
    const fisrtPosition = sortedPositions[0];
    const lastPosition = sortedPositions[sortedPositions.length - 1];

    // positions[0]에서 positions[2]으로 향하는 방향
    const { dx, dy } = Board.getDirection(fisrtPosition, lastPosition);

    const bothSideEmpty =
      this.board.canDropStone(createPosition(fisrtPosition.x + -dx, fisrtPosition.y + -dy)) &&
      this.board.canDropStone(createPosition(lastPosition.x + dx, lastPosition.y + dy));

    if (!bothSideEmpty) return false;

    // 띈 4 확인
    const isHaveConnectedStone =
      this.board.get(createPosition(fisrtPosition.x + -dx * 2, fisrtPosition.y + -dy * 2)) ===
        STONE.BLACK.POINT ||
      this.board.get(createPosition(lastPosition.x + dx * 2, lastPosition.y + dy * 2)) ===
        STONE.BLACK.POINT;

    if (isHaveConnectedStone) return false;

    const distance = getDistance(fisrtPosition, lastPosition);

    // 붙은 3
    if (distance === 2) return Board.isSequential(sortedPositions);
    // 띈 3
    if (distance === 3) return Board.isSequentialSkipOnce(sortedPositions);

    return false;
  }

  /** open four인지 확인 */
  private checkOpenFour(positions: [Position, Position, Position, Position]) {
    const isHaveWhite = positions.some(
      (position) => this.board.get(position) === STONE.WHITE.POINT,
    );

    if (isHaveWhite) return false;

    const sortedPositions = sortPositions(positions);
    const fisrtPosition = sortedPositions[0];
    const lastPosition = sortedPositions[sortedPositions.length - 1];

    const { dx, dy } = Board.getDirection(fisrtPosition, lastPosition);
    const distance = getDistance(fisrtPosition, lastPosition);
    const bothSideEmpty =
      this.board.canDropStone(createPosition(fisrtPosition.x + -dx, fisrtPosition.y + -dy)) &&
      this.board.canDropStone(createPosition(lastPosition.x + dx, lastPosition.y + dy));

    if (!bothSideEmpty) return false;
    // 붙은 4
    if (distance === 3) return Board.isSequential(sortedPositions);
    // 띈 4
    if (distance === 4) return Board.isSequentialSkipOnce(sortedPositions);

    return false;
  }

  /** 흑 4*4 금수 */
  private sasa() {}

  /** 흑 장목(6목) */
  private jangmok() {
    const { x, y } = this.position;

    /** 장목 금수 위치 찾는 재귀함수 */
    const find = (
      pos: Position,
      direction: Direction,
      count: number,
      jumpPos?: Position,
    ): Position | undefined => {
      // 점프한 구간이 있고 카운트가 5가 된 경우 장목 위치 반환
      if (count === 5 && jumpPos) {
        return jumpPos;
      }

      const [nx, ny] = [pos.x + direction.dx, pos.y + direction.dy];

      // 유효하지 않은 위치인 경우
      if (!Board.isValidStonePosition(createPosition(nx, ny))) return undefined;

      const target = this.board.get(createPosition(nx, ny));

      if (target === STONE.WHITE.POINT) return undefined;
      // 점프 이후 또 빈 셀을 만난 경우
      if (target === EMPTY && jumpPos) return undefined;

      // 1회 점프 허용(count가 5일시 장목이 될 자리)
      if (target === EMPTY && !jumpPos) {
        return find({ x: nx, y: ny }, direction, count, { x: nx, y: ny });
      }

      return find({ x: nx, y: ny }, direction, count + 1, jumpPos);
    };

    for (let i = 0; i < DIRECTIONS.length; i += 1) {
      const { dx, dy } = DIRECTIONS[i];

      // 반대 방향 돌 카운팅
      const reverseDirectionStones = this.board.countStones(
        createPosition(x + -dx, y + -dy),
        createDirection(-dx, -dy),
        STONE.BLACK.POINT,
      );

      const geumsuPosition = find(
        createPosition(x, y),
        createDirection(dx, dy),
        1 + reverseDirectionStones, // 현재 위치 돌 카운팅, 1부터 시작
      );

      if (geumsuPosition) {
        this.geumsu.jangmok.push(geumsuPosition);
      }
    }
  }
}

export default RenjuRule;
