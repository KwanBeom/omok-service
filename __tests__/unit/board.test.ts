import Board from '@/app/_omok/Board';
import { STONE, StonePoint } from '@/app/_omok/Stone';
import { createDirection, createPosition } from '@/app/_omok/utils';

describe('Board Class Tests', () => {
  test('canDropStone test', () => {
    const board = new Board();
    const position = createPosition(7, 7);

    board.dropStone(position, STONE.BLACK.POINT);

    const result = board.canDropStone(position);

    expect(result).toBe(false);
  });

  test('countStones test', () => {
    const board = new Board();
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
      board.dropStone(positions[i], ((i % 2) + 1) as StonePoint);
    }

    const result = board.countStones(
      createPosition(7, 11),
      createDirection(0, -1),
      STONE.BLACK.POINT,
    );

    expect(result).toBe(5);
  });
});
