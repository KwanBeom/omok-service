import Board from '@/app/_omok/core/Board';
import Direction from '@/app/_omok/entities/Direction';
import Position from '@/app/_omok/entities/Position';
import { StoneColor } from '@/app/_omok/entities/Stone';

describe('Board Class Tests', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  test('canDropStone test, 이미 놓아진 위치에 돌을 놓으려고 하는 경우 false', () => {
    const position = new Position(7, 7);

    board.dropStone(position, 'black');

    const result = board.canDropStone(position);

    expect(result).toBe(false);
  });

  test('removeStone test, 돌을 제거하고 canDropStone 함수로 확인했을 때 true', () => {
    const position = new Position(7, 7);
    board.dropStone(position, 'black');
    board.removeStone(position);

    const result = board.canDropStone(position);

    expect(result).toBe(true);
  });

  describe('countStones test', () => {
    test('countStones test 1, 한 방향으로 돌을 세는 테스트', () => {
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

    test('countStones test 2, 흰돌이 끼어있어 셀 수 없는 경우', () => {
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

    test('countStones test 3, ', () => {
      const positions = [new Position(7, 7), new Position(7, 9), new Position(7, 11)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], 'black');
      }

      expect(
        board.countStones(new Position(7, 8), new Direction(0, 1), 'black', {
          assumeStonePlaced: true,
          skip: 1,
        }),
      ).toBe(3);

      expect(
        board.countStones(new Position(7, 8), new Direction(0, -1), 'black', {
          assumeStonePlaced: true,
        }),
      ).toBe(2);
    });

    test('countStones assumeStonePlaced option test, 빈 위치부터 탐색을 시작해 한 방향으로 돌을 세는 경우', () => {
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

    test('countStones skip option test 1, 한 칸이 띄워져있지만 skip 인자를 전달해 4개의 돌이 세어지는 경우', () => {
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
  });

  describe('countStonesInBothDirection test', () => {
    test('countStonesInBothDirection test, 양 방향으로 돌을 세는 기본 동작 테스트', () => {
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

    test('countStonesInBothDirection skip option test, 중간에서 시작해 양 방향으로 동일한 인자를 전달한 경우 똑같이 카운팅 되는지 테스트', () => {
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

    test('countStonesInBothDirection assumeStonePlaced option test, 빈 위치부터 탐색 시작하는 경우', () => {
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
  });

  describe('isNConnected test', () => {
    test('isNConnected test 1, 기본 동작 테스트', () => {
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

    test('isNConnected test 2, 빈 위치부터 시작해 assumeStonePlaced 옵션을 전달해 확인하는 경우', () => {
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

    test('isNConnected test 3, 빈 위치부터 시작해 assumeStonePlaced 옵션을 전달해 확인하는 경우', () => {
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

    test('isNConnected test 4, 빈 위치부터 시작해 assumeStonePlaced 옵션을 전달해 확인하는 경우', () => {
      const positions = [new Position(7, 7), new Position(7, 9), new Position(7, 11)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], 'black');
      }

      const result = board.isNConnected(new Position(7, 8), 'black', 4, {
        assumeStonePlaced: true,
      });

      expect(result).toBe(true);
    });
  });

  describe('findConnectedStones test', () => {
    test('findConnectedStones, 이어져 있는 2개의 돌을 탐색하는지 테스트', () => {
      const positions = [new Position(7, 7), new Position(8, 7)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], 'black');
      }

      const result = board.findConnectedStones(positions[1], 'black', 2);

      expect(result[0]).toEqual(expect.arrayContaining(positions));
    });

    test('findConnectedStones, 한 칸 띄워져 있는 2개의 돌을 탐색하는지 테스트', () => {
      const positions = [new Position(7, 7), new Position(9, 7)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], 'black');
      }

      const result = board.findConnectedStones(positions[0], 'black', 2);

      expect(result[0]).toEqual(expect.arrayContaining(positions));
    });

    test('findConnectedStones, 이어져 있는 3개의 돌을 탐색하는지 테스트', () => {
      const positions = [new Position(7, 7), new Position(8, 7), new Position(9, 7)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], 'black');
      }

      const result = board.findConnectedStones(positions[0], 'black', 3);

      expect(result[0]).toEqual(expect.arrayContaining(positions));
    });

    test('findConnectedStones, 현재 위치가 비어져 있는 경우 positionIsEmpty 옵션으로 빈 위치를 건너뛰고 이어져 있는 3개의 돌을 잘 탐색하는지 테스트', () => {
      const positions = [new Position(5, 9), new Position(4, 10), new Position(3, 11)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], 'black');
      }

      const result = board.findConnectedStones(new Position(7, 7), 'black', 3, {
        positionIsEmpty: true,
      });

      expect(result[0]).toEqual(expect.arrayContaining(positions));
    });

    test('findConnectedStones, 대각선으로 한 칸 띄워 이어져있는 돌들을 skip 옵션을 활용해 탐색하는 경우', () => {
      const positions = [new Position(7, 7), new Position(5, 9), new Position(4, 10)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], 'black');
      }

      const result = board.findConnectedStones(positions[0], 'black', 3, { skip: 1 });

      expect(result[0]).toEqual(expect.arrayContaining(positions));
    });

    test('findConnectedStones, OVOVO 형태의 돌을 skip 옵션을 2로 전달하고, 맨 끝부터 탐색을 시작해 잘 탐색하는지 테스트', () => {
      const positions = [new Position(7, 7), new Position(7, 9), new Position(7, 11)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], 'black');
      }

      const result = board.findConnectedStones(positions[0], 'black', 3, {
        skip: 2,
      });

      expect(result[0]).toEqual(expect.arrayContaining(positions));
    });

    test('findConnectedStones, OVOVO 형태의 돌을 skip 옵션을 2로 전달하고, 중간에 위치한 돌부터 탐색을 시작해 잘 탐색하는지 테스트', () => {
      const positions = [new Position(7, 7), new Position(7, 9), new Position(7, 11)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], 'black');
      }

      const result = board.findConnectedStones(positions[1], 'black', 3, {
        skip: 2,
      });

      expect(result[0]).toEqual(expect.arrayContaining(positions));
    });

    test('findConnectedStones, OOVVO 형태의 돌을 skip 옵션을 2로 전달해 잘 탐색하는지 테스트', () => {
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
