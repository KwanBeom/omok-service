import Board from '../../server/omok/core/Board';
import Direction from '../../server/omok/entities/Direction';
import Position from '../../server/omok/entities/Position';
import { StoneColor } from '../../server/omok/entities/Stone';

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

      const result = board.countStones(new Position(7, 7), Direction.RIGHT, 'black');

      expect(result).toBe(0);
    });

    test('countStones test 3, ', () => {
      const positions = [new Position(7, 7), new Position(7, 9), new Position(7, 11)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], 'black');
      }

      expect(
        board.countStones(new Position(7, 8), Direction.RIGHT, 'black', {
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

      const result = board.countStones(new Position(7, 6), Direction.RIGHT, 'black', {
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

      const result = board.countStones(positions[0], Direction.RIGHT, 'black', {
        skip: 1,
      });

      expect(result).toBe(4);
    });
  });

  describe('countStonesInBothDirection test', () => {
    test('양 방향으로 돌을 세는 기본 동작 테스트', () => {
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

    test('skip option test, 중간에서 시작해 양 방향으로 동일한 인자를 전달한 경우 똑같이 카운팅 되는지 테스트', () => {
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

      const expected2 = board.countStonesInBothDirections(positions[0], Direction.RIGHT, 'black', {
        skip: true,
      });

      expect(expected1).toBe(6);
      expect(expected2).toBe(6);
    });

    test('assumeStonePlaced option test, 빈 위치부터 탐색 시작하는 경우', () => {
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
    test('기본 동작 테스트', () => {
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

    test('빈 위치부터 시작해 assumeStonePlaced 옵션을 전달해 확인하는 경우', () => {
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

    test('빈 위치부터 시작해 assumeStonePlaced 옵션을 전달해 확인하는 경우 2', () => {
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

    test('빈 위치부터 시작해 assumeStonePlaced, strictMode 옵션을 전달해 확인하는 경우 3', () => {
      const positions = [new Position(7, 7), new Position(7, 9), new Position(7, 11)];

      for (let i = 0; i < positions.length; i += 1) {
        board.dropStone(positions[i], 'black');
      }

      const result = board.isNConnected(new Position(7, 8), 'black', 4, {
        assumeStonePlaced: true,
        strictMode: true,
      });

      expect(result).toBe(true);
    });

    test('빈 위치부터 시작해 assumeStonePlaced 옵션을 전달해 확인하는 경우 4', () => {
      const positions = [
        new Position(7, 7),
        new Position(7, 9),
        new Position(7, 10),
        new Position(7, 12),
      ];
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
    describe('거짓 케이스', () => {
      test('positionIsEmpty 옵션과 skip 옵션 활성화, 2번 스킵해야 탐색할 수 있어 탐색할 수 없는 거짓인 테스트 케이스', () => {
        const positions = [new Position(7, 8), new Position(7, 11)];
        for (let i = 0; i < positions.length; i += 1) {
          board.dropStone(positions[i], 'black');
        }

        const result = board.findConnectedStones(new Position(7, 7), 'black', 2, {
          positionIsEmpty: true,
          skip: 1,
        });

        expect(result).toEqual([]);
      });
    });

    describe('2개의 모든 유형 돌을 탐색하는지 테스트', () => {
      const testCases = [
        { positions: [new Position(7, 7), new Position(7, 8)], description: '우측으로 이어진 2' },
        { positions: [new Position(7, 7), new Position(7, 6)], description: '좌측으로 이어진 2' },
        {
          positions: [new Position(7, 7), new Position(9, 7)],
          options: { skip: 1 },
          description: 'skip 옵션, 하단으로 1칸 띄고 이어진 2',
        },
        {
          positions: [new Position(7, 7), new Position(4, 10)],
          options: { skip: 2 },
          description: 'skip 옵션, 좌상 대각으로 2칸 띄고 이어진 2',
        },
        {
          positions: [new Position(6, 8), new Position(5, 9)],
          options: { positionIsEmpty: true },
          description: '빈 포지션에서 시작해 positionIsEmtpy 옵션 활성화, 좌상 대각으로 이어진 2',
        },
        {
          positions: [new Position(7, 6), new Position(7, 9)],
          options: { positionIsEmpty: true, skip: 1 },
          description:
            '빈 포지션에서 시작해 positionIsEmtpy, skip 옵션 활성화, 시작 위치 기준 좌측으로 1칸, 우측으로 2칸에 위치한 2를 탐색하는지 테스트',
        },
      ];

      test.each(testCases)('$description', ({ positions, options }) => {
        for (let i = 0; i < positions.length; i += 1) {
          board.dropStone(positions[i], 'black');
        }

        const result = board.findConnectedStones(new Position(7, 7), 'black', 2, options);

        expect(result[0]).toEqual(expect.arrayContaining(positions));
      });
    });

    describe('3개의 모든 유형 돌을 탐색하는지 테스트', () => {
      const testCases = [
        {
          positions: [new Position(7, 7), new Position(7, 8), new Position(7, 9)],
          description: '우측으로 이어진 3',
        },
        {
          positions: [new Position(7, 6), new Position(7, 8), new Position(7, 9)],
          options: { positionIsEmpty: true },
          description: '빈 위치에서 좌측으로 1개 우측으로 2개 위치한 3(OVOO)',
        },
        {
          positions: [new Position(7, 6), new Position(7, 5), new Position(7, 4)],
          options: { positionIsEmpty: true },
          description: 'positionIsEmpty 옵션 활성화 빈 위치에서 시작해 좌측으로 이어진 3',
        },
        {
          positions: [new Position(7, 9), new Position(7, 10), new Position(7, 11)],
          options: { positionIsEmpty: true, skip: 1 },
          description: 'positionIsEmpty 옵션 활성화, 빈 위치에서 시작해 우측으로 2칸 떨어진 3',
        },
        {
          positions: [new Position(7, 7), new Position(7, 9), new Position(7, 5)],
          options: { skip: 2 },
          description:
            '가운데 돌부터 시작해, 좌/우측 1칸씩 떨어져 있는 총 3개의 돌(OVOVO)을 탐색하는지 테스트',
        },
        {
          positions: [new Position(7, 7), new Position(7, 9), new Position(7, 11)],
          options: { skip: 2 },
          description:
            '좌측 끝 돌부터 시작해, 1칸씩 떨어져 있는 총 3개의 돌(OVOVO)을 탐색하는지 테스트',
        },
        {
          positions: [new Position(7, 6), new Position(7, 9), new Position(7, 10)],
          options: { positionIsEmpty: true, skip: 1 },
          description:
            '빈 위치에서 시작해, 우측으로 1칸 떨어져있는 2와, 좌측에 위치한 돌(OVVOO) 총 3개의 돌을 탐색하는지 테스트',
        },
        {
          positions: [new Position(7, 6), new Position(7, 4), new Position(7, 3)],
          options: { positionIsEmpty: true, skip: 1 },
          description: '빈 위치에서 시작해, OOVO 형태로 놓여져 있는 돌을 탐색하는지 테스트',
        },
        {
          positions: [new Position(7, 8), new Position(7, 10), new Position(7, 11)],
          options: { positionIsEmpty: true, skip: 1 },
          description: '빈 위치에서 시작해, OOVO 형태로 놓여져 있는 돌을 탐색하는지 테스트',
        },
        {
          positions: [new Position(7, 9), new Position(7, 10), new Position(7, 11)],
          options: { positionIsEmpty: true, skip: 1 },
          description: '빈 위치에서 시작해, 우측에 2칸 띄워있는 돌을 탐색하는지 테스트',
        },
        {
          positions: [new Position(7, 6), new Position(7, 5), new Position(7, 9)],
          options: { positionIsEmpty: true, skip: 1 },
          description:
            '빈 위치에서 시작해, 좌측에 2개의 돌, 우측으로 1칸 띄워있는 1개의 돌을 탐색하는지 테스트',
        },
        {
          positions: [new Position(4, 7), new Position(5, 7), new Position(8, 7)],
          options: { positionIsEmpty: true, skip: 1 },
          description:
            '빈 위치에서 시작해, 위로 2개의 돌, 아래로 1칸 띄워있는 1개의 돌을 탐색하는지 테스트',
        },
        {
          positions: [new Position(5, 9), new Position(4, 10), new Position(3, 11)],
          options: { positionIsEmpty: true, skip: 1 },
          description: '빈 위치에서 시작해, 우상단으로 1칸 띄고 이어져 있는 돌 탐색하는지 테스트',
        },
        {
          positions: [new Position(9, 5), new Position(10, 4), new Position(11, 3)],
          options: { positionIsEmpty: true, skip: 1 },
          description: '빈 위치에서 시작해, 좌하단으로 1칸 띄고 이어져 있는 돌 탐색하는지 테스트',
        },
      ];

      // test.only(testCases[5].description, () => {
      //   const { positions, options } = testCases[4];
      //   for (let i = 0; i < positions.length; i += 1) {
      //     board.dropStone(positions[i], 'black');
      //   }

      //   const result = board.findConnectedStones(new Position(7, 7), 'black', 3, options);

      //   expect(result[0]).toEqual(expect.arrayContaining(positions));
      // });

      test.each(testCases)('$description', ({ positions, options }) => {
        for (let i = 0; i < positions.length; i += 1) {
          board.dropStone(positions[i], 'black');
        }

        const result = board.findConnectedStones(new Position(7, 7), 'black', 3, options);

        expect(result[0]).toEqual(expect.arrayContaining(positions));
      });
    });

    describe('빈 교점에 여러 개의 3을 잘 탐색하는지 테스트', () => {
      const testCases = [
        {
          positions: [
            [new Position(7, 6), new Position(7, 8), new Position(7, 9)],
            [new Position(5, 7), new Position(4, 7), new Position(3, 7)],
          ],
          options: { positionIsEmpty: true, skip: 1 },
          startPosition: new Position(7, 7),
          description:
            '빈 위치에서 positionIsEmpty, skip 옵션 활성화 하고 2개의 3을 잘 찾는지 테스트',
        },
      ];

      test.each(testCases)('$description', ({ positions, options, startPosition }) => {
        for (let i = 0; i < positions.length; i += 1) {
          for (let j = 0; j < positions[i].length; j += 1) {
            board.dropStone(positions[i][j], 'black');
          }
        }

        const result = board.findConnectedStones(startPosition, 'black', 3, options);
        expect(result).toHaveLength(positions.length);

        for (let i = 0; i < positions.length; i += 1) {
          expect(result.flat()).toEqual(expect.arrayContaining(positions[i]));
        }
      });
    });
  });
});
