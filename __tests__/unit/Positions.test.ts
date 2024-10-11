import Direction from '@/app/_omok/entities/Direction';
import Position from '@/app/_omok/entities/Position';
import Positions from '@/app/_omok/entities/Positions';

describe('positions test', () => {
  const positions = [new Position(7, 7), new Position(7, 8)];
  const instance = new Positions(...positions);

  beforeEach(() => {
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

  test('getDistance test', () => {
    const distance = Positions.getDistance(positions[0], positions[1]);

    expect(distance).toBe(1);
  });

  test('getDirection test', () => {
    const direction = Positions.getDirection(positions[0], positions[1]);

    expect(direction).toEqual(new Direction(0, 1));
  });

  test('getDirection test', () => {
    const direction = Positions.getDirection(positions[0], positions[1]);

    expect(direction).toEqual(new Direction(0, 1));
  });
});
