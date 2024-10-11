import Board from '@/app/_omok/core/Board';
import Direction from '@/app/_omok/entities/Direction';
import Position from '@/app/_omok/entities/Position';
import { StoneColor } from '@/app/_omok/entities/Stone';

describe('Board Class Tests', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  test('canDropStone test', () => {
    const position = new Position(7, 7);

    board.dropStone(position, 'black');

    const result = board.canDropStone(position);

    expect(result).toBe(false);
  });

  test('countStones test 1', () => {
    const positions = [
      new Position(7, 7),
      new Position(7, 8),
      new Position(7, 9),
      new Position(7, 10),
      new Position(7, 11),
    ];

    for (let i = 1; i < positions.length + 1; i += 1) {
      board.dropStone(positions[i - 1], 'black');
    }

    const result = board.countStones(new Position(7, 11), new Direction(0, -1), 'black');

    expect(result).toBe(5);
  });

  test('countStones test 2', () => {
    const positions: [Position, StoneColor][] = [
      [new Position(7, 7), 'white'],
      [new Position(7, 8), 'black'],
      [new Position(7, 9), 'black'],
      [new Position(7, 10), 'black'],
      [new Position(7, 11), 'black'],
    ];

    for (let i = 0; i < positions.length; i += 1) {
      const [position, stone] = positions[i];

      board.dropStone(position, stone);
    }

    const result = board.countStones(new Position(7, 7), new Direction(0, 1), 'black');

    expect(result).toBe(0);
  });

  test('countStones assumeStonePlaced option test', () => {
    const positions = [
      new Position(7, 7),
      new Position(7, 8),
      new Position(7, 9),
      new Position(7, 10),
    ];

    for (let i = 0; i < positions.length; i += 1) {
      board.dropStone(positions[i], 'black');
    }

    const result = board.countStones(new Position(7, 6), new Direction(0, 1), 'black', {
      assumeStonePlaced: true,
    });

    expect(result).toBe(5);
  });

  test('countStones skip option test', () => {
    const positions = [
      new Position(7, 7),
      new Position(7, 8),
      new Position(7, 10),
      new Position(7, 11),
    ];

    for (let i = 0; i < positions.length; i += 1) {
      board.dropStone(positions[i], 'black');
    }

    const result = board.countStones(positions[0], new Direction(0, 1), 'black', {
      skip: 1,
    });

    expect(result).toBe(4);
  });

  test('countStonesInBothDirection test', () => {
    const positions = [
      new Position(7, 7),
      new Position(7, 6),
      new Position(7, 8),
      new Position(7, 9),
      new Position(7, 10),
    ];

    for (let i = 0; i < positions.length; i += 1) {
      board.dropStone(positions[i], 'black');
    }

    const result = board.countStonesInBothDirections(positions[0], new Direction(0, -1), 'black');

    expect(result).toBe(5);
  });

  test('countStonesInBothDirection skip option test', () => {
    const positions = [
      new Position(7, 7),
      new Position(7, 4),
      new Position(7, 5),
      new Position(7, 8),
      new Position(7, 9),
      new Position(7, 10),
    ];

    for (let i = 0; i < positions.length; i += 1) {
      board.dropStone(positions[i], 'black');
    }

    const expected1 = board.countStonesInBothDirections(
      positions[0],
      new Direction(0, -1),
      'black',
      { skip: true },
    );

    const expected2 = board.countStonesInBothDirections(
      positions[0],
      new Direction(0, 1),
      'black',
      { skip: true },
    );

    expect(expected1).toBe(6);
    expect(expected2).toBe(6);
  });

  test('countStonesInBothDirection assumeStonePlaced option test 1', () => {
    const positions = [
      new Position(7, 5),
      new Position(7, 7),
      new Position(7, 8),
      new Position(7, 9),
      new Position(7, 10),
    ];

    for (let i = 0; i < positions.length; i += 1) {
      board.dropStone(positions[i], 'black');
    }

    const result = board.countStonesInBothDirections(
      new Position(7, 6),
      new Direction(0, -1),
      'black',
      { assumeStonePlaced: true },
    );

    expect(result).toBe(6);
  });

  test('isNConnected test 1', () => {
    const positions = [
      new Position(7, 7),
      new Position(7, 8),
      new Position(7, 9),
      new Position(7, 10),
    ];

    for (let i = 0; i < positions.length; i += 1) {
      board.dropStone(positions[i], 'black');
    }

    const result = board.isNConnected(positions[0], 'black', 4);

    expect(result).toBe(true);
  });

  test('isNConnected test 2', () => {
    const positions = [
      new Position(7, 7),
      new Position(7, 8),
      new Position(7, 9),
      new Position(7, 11),
    ];

    for (let i = 0; i < positions.length; i += 1) {
      board.dropStone(positions[i], 'black');
    }

    expect(board.isNConnected(new Position(7, 10), 'black', 5, { assumeStonePlaced: true })).toBe(
      true,
    );
  });

  test('isNConnected test 3', () => {
    const positions = [
      new Position(2, 2),
      new Position(1, 1),
      new Position(0, 0),
      new Position(3, 2),
      new Position(3, 0),
      new Position(3, 1),
    ];

    for (let i = 0; i < positions.length; i += 1) {
      board.dropStone(positions[i], 'black');
    }

    const result = board.isNConnected(new Position(3, 3), 'black', 4, {
      assumeStonePlaced: true,
    });

    expect(result).toBe(true);
  });

  describe('findConnectedStones test', () => {
    test('findConnectedStones, solid two stones', () => {
      const positions = [new Position(7, 7), new Position(8, 7)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], 'black');
      }

      const result = board.findConnectedStones(positions[1], 'black', 2);

      expect(result[0]).toEqual(expect.arrayContaining(positions));
    });

    test('findConnectedStones, skip once two stones', () => {
      const positions = [new Position(7, 7), new Position(9, 7)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], 'black');
      }

      const result = board.findConnectedStones(positions[0], 'black', 2);

      expect(result[0]).toEqual(expect.arrayContaining(positions));
    });

    test('findConnectedStones, three stones', () => {
      const positions = [new Position(7, 7), new Position(8, 7), new Position(9, 7)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], 'black');
      }

      const result = board.findConnectedStones(positions[0], 'black', 3);

      expect(result[0]).toEqual(expect.arrayContaining(positions));
    });

    test('findConnectedStones, positionIsEmpty option', () => {
      const positions = [new Position(5, 9), new Position(4, 10), new Position(3, 11)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], 'black');
      }

      const result = board.findConnectedStones(new Position(7, 7), 'black', 3, {
        positionIsEmpty: true,
      });

      expect(result[0]).toEqual(expect.arrayContaining(positions));
    });

    test('findConnectedStones, skip once three stones', () => {
      const positions = [new Position(7, 7), new Position(5, 9), new Position(4, 10)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], 'black');
      }

      const result = board.findConnectedStones(positions[0], 'black', 3, { skip: 1 });

      expect(result[0]).toEqual(expect.arrayContaining(positions));
    });

    test('findConnectedStones, skip twice three stones (OVOVO)', () => {
      const positions = [new Position(7, 7), new Position(7, 9), new Position(7, 11)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], 'black');
      }

      const result = board.findConnectedStones(positions[0], 'black', 3, {
        skip: 2,
      });

      expect(result[0]).toEqual(expect.arrayContaining(positions));
    });

    test('findConnectedStones, skip twice three stones (OOVVO)', () => {
      const positions = [new Position(7, 7), new Position(7, 10), new Position(7, 6)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], 'black');
      }

      const result = board.findConnectedStones(positions[0], 'black', 3, {
        skip: 2,
      });

      expect(result[0]).toEqual(expect.arrayContaining(positions));
    });
  });
});
