import Board from '@/app/_omok/Board';
import { STONE, StonePoint } from '@/app/_omok/Stone';
import { createDirection, createPosition } from '@/app/_omok/utils';

describe('Board Class Tests', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  test('canDropStone test', () => {
    const position = createPosition(7, 7);

    board.dropStone(position, STONE.BLACK.POINT);

    const result = board.canDropStone(position);

    expect(result).toBe(false);
  });

  test('countStones test', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(0, 0),
      createPosition(7, 8),
      createPosition(0, 1),
      createPosition(7, 9),
      createPosition(0, 2),
      createPosition(7, 10),
      createPosition(0, 3),
      createPosition(7, 11),
    ];

    for (let i = 1; i < positions.length + 1; i += 1) {
      board.dropStone(positions[i - 1], (i % 2) as StonePoint);
    }

    const result = board.countStones(
      createPosition(7, 11),
      createDirection(0, -1),
      STONE.BLACK.POINT,
    );

    expect(result).toBe(5);
  });

  describe('findConnectedStones test', () => {
    test('findConnectedStones, solid two stones', () => {
      const positions = [createPosition(7, 7), createPosition(8, 7)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], STONE.BLACK.POINT);
      }

      const result = board.findConnectedStones(positions[1], STONE.BLACK.POINT, 2);

      expect(result[0]).toEqual(expect.arrayContaining(positions));
    });

    test('findConnectedStones, skip once two stones', () => {
      const positions = [createPosition(7, 7), createPosition(9, 7)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], STONE.BLACK.POINT);
      }

      const result = board.findConnectedStones(positions[0], STONE.BLACK.POINT, 2);

      expect(result[0]).toEqual(expect.arrayContaining(positions));
    });

    test('findConnectedStones, three stones', () => {
      const positions = [createPosition(7, 7), createPosition(8, 7), createPosition(9, 7)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], STONE.BLACK.POINT);
      }

      const result = board.findConnectedStones(positions[0], STONE.BLACK.POINT, 3);

      expect(result[0]).toEqual(expect.arrayContaining(positions));
    });

    test('findConnectedStones, positionIsEmpty option', () => {
      const positions = [createPosition(5, 9), createPosition(4, 10), createPosition(3, 11)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], STONE.BLACK.POINT);
      }

      const result = board.findConnectedStones(createPosition(7, 7), STONE.BLACK.POINT, 3, {
        positionIsEmpty: true,
      });

      expect(result[0]).toEqual(expect.arrayContaining(positions));
    });

    test('findConnectedStones, skip once three stones', () => {
      const positions = [createPosition(7, 7), createPosition(5, 9), createPosition(4, 10)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], STONE.BLACK.POINT);
      }

      const result = board.findConnectedStones(positions[0], STONE.BLACK.POINT, 3, { skip: 1 });

      expect(result[0]).toEqual(expect.arrayContaining(positions));
    });

    test('findConnectedStones, skip twice three stones (OVOVO)', () => {
      const positions = [createPosition(7, 7), createPosition(7, 9), createPosition(7, 11)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], STONE.BLACK.POINT);
      }

      const result = board.findConnectedStones(positions[0], STONE.BLACK.POINT, 3, {
        skip: 2,
      });

      expect(result[0]).toEqual(expect.arrayContaining(positions));
    });

    test('findConnectedStones, skip twice three stones (OOVVO)', () => {
      const positions = [createPosition(7, 7), createPosition(7, 10), createPosition(7, 6)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], STONE.BLACK.POINT);
      }

      const result = board.findConnectedStones(positions[0], STONE.BLACK.POINT, 3, {
        skip: 2,
      });

      expect(result[0]).toEqual(expect.arrayContaining(positions));
    });
  });
});
