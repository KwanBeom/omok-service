import Direction from '@/app/_omok/entities/Direction';
import Position, { IPosition, IPositionTuple } from '@/app/_omok/entities/Position';
import Positions from '@/app/_omok/entities/Positions';

describe('positions test', () => {
  let positions = [new Position(7, 7), new Position(7, 8)];
  const instance = new Positions(...positions);

  beforeEach(() => {
    positions = [new Position(7, 7), new Position(7, 8)];

    instance.clear();

    for (let i = 0; i < positions.length; i += 1) {
      instance.add(positions[i]);
    }
  });

  test('removeDuplicates test', () => {
    instance.add(positions[0]);
    instance.removeDuplicates();

    expect(instance.getAll()).toStrictEqual(positions.slice(0, 2));
  });

  test('sort test', () => {
    instance.add(new Position(7, 5));
    instance.sort();

    expect(instance.getAll()).toEqual([new Position(7, 5), new Position(7, 7), new Position(7, 8)]);
  });

  test('getSkippedPosition test', () => {
    const skippedPosition = Positions.getSkippedPosition([...positions, new Position(7, 10)]);

    expect(skippedPosition).toEqual(new Position(7, 9));
  });

  test('isSequential test', () => {
    expect(Positions.isSequential(positions)).toBe(true);

    positions.push(new Position(7, 10));

    expect(Positions.isSequential(positions)).toBe(false);
  });

  test('isSequentialSkipOnce test', () => {
    positions.push(new Position(7, 10));

    expect(Positions.isSequentialSkipOnce(positions)).toBe(true);

    positions.push(new Position(7, 13));

    expect(Positions.isSequentialSkipOnce(positions)).toBe(false);
  });
});
