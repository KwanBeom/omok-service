import Direction from '../../server/omok/entities/Direction';
import Position, { IPosition } from '../../server/omok/entities/Position';
import PositionHelper from '../../server/omok/entities/PositionHelper';

describe('positions test', () => {
  let positions: IPosition[] = [];

  beforeEach(() => {
    positions = [new Position(7, 7), new Position(7, 8)];
  });

  test('removeDuplicates test', () => {
    positions.push(positions[0]);
    expect(PositionHelper.removeDuplicates(positions)).toStrictEqual(positions.slice(0, 2));
  });

  test('sort test', () => {
    positions.push(new Position(7, 5));

    expect(PositionHelper.sort(positions)).toEqual([
      new Position(7, 5),
      new Position(7, 7),
      new Position(7, 8),
    ]);
  });

  test('getSkippedPosition test', () => {
    const skippedPosition = PositionHelper.getSkippedPosition([...positions, new Position(7, 10)]);

    expect(skippedPosition).toEqual(new Position(7, 9));
  });

  test('isSequential test', () => {
    expect(PositionHelper.isSequential(positions)).toBe(true);

    positions.push(new Position(7, 10));

    expect(PositionHelper.isSequential(positions)).toBe(false);
  });

  test('isSequentialSkipOnce test', () => {
    positions.push(new Position(7, 10));

    expect(PositionHelper.isSequentialSkipOnce(positions)).toBe(true);

    positions.push(new Position(7, 13));

    expect(PositionHelper.isSequentialSkipOnce(positions)).toBe(false);
  });

  test('getDistance test', () => {
    const distance = PositionHelper.getDistance(positions[0], positions[1]);

    expect(distance).toBe(1);
  });

  test('getDirection test', () => {
    const direction = PositionHelper.getDirection(positions[0], positions[1]);

    expect(direction).toEqual(Direction.RIGHT);
  });
});
