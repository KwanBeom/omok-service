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
} from './utils';

type OpenTwo = [Position, Position];

export type RenjuGeumsu = {
  samsam: { position: Position; openTwoPositions: OpenTwo[] }[];
  sasa: Position[];
  jangmok: Position[];
};

class RenjuRule {
  private geumsu: RenjuGeumsu = {
    samsam: [],
    sasa: [],
    jangmok: [],
  };

  private board: Board;

  private position: Position = { x: 0, y: 0 };

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

      const checkOpenThreeWithPosition = (position: Position) => {
        const isOpenThree =
          this.board.canDropStone(position) &&
          this.checkOpenThree([currentPosition, openTwoSpot, position]);

        return isOpenThree;
      };

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

  /** openTwo들로 spot이 3*3 금수가 가능한지 확인 */
  private checkCanSamsam(spot: Position, openTwos: OpenTwo[]) {
    // 열린 2는 여러개 가능
    const filteredOpenTwos = openTwos.filter((openTwo) => this.checkOpenThree([spot, ...openTwo]));

    // 교점에 open two 2개 이상이면 3*3 금수 가능
    return filteredOpenTwos.length >= 2;
  }

  /** 해당 포지션에 돌 3개가 놓아졌을 때 open three인지 확인 */
  private checkOpenThree(positions: [Position, Position, Position]) {
    positions.sort((prev, curr) => prev.x - curr.x || prev.y - curr.y);

    // positions[0]에서 positions[2]으로 향하는 방향
    const { dx, dy } = Board.getDirection(positions[0], positions[2]);
    const distance = getDistance(positions[0], positions[2]);
    const bothSideEmpty =
      this.board.canDropStone(createPosition(positions[0].x + -dx, positions[0].y + -dy)) &&
      this.board.canDropStone(createPosition(positions[2].x + dx, positions[2].y + dy));

    if (!bothSideEmpty) return false;

    // 붙은 3 OOO
    if (distance === 2) return Board.isSequential(positions);

    // 띈 3 OVOO / OOVO
    if (distance === 3) {
      let { x, y } = positions[0];
      let skip = false;

      for (let i = 0; i < positions.length - 1; i += 1) {
        const currentPosition = createPosition(x, y);

        if (!Board.isValidStonePosition(currentPosition)) return false;
        if (this.board.get(currentPosition) === STONE.WHITE.POINT) return false;

        const next = positions[i + 1];

        if (!(x + dx === next.x && y + dy === next.y)) {
          if (skip || !this.board.canDropStone(createPosition(x + dx, y + dy))) return false;

          skip = true;
          x += dx;
          y += dy;
        }

        x += dx;
        y += dy;
      }

      return true;
    }

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
