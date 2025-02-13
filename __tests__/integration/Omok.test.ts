import Omok from '../../server/omok/core/Omok';
import Position from '../../server/omok/entities/Position';
import { playStones } from '../utils/utils';

describe('omok tests', () => {
  let omok: Omok;

  beforeEach(() => {
    omok = new Omok();
  });

  test('undo test 1, 3*3 금수가 해금 되는지', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(7, 9),
      new Position(14, 13),
      new Position(8, 8),
      new Position(13, 14),
      new Position(6, 8),
      new Position(13, 13),
      new Position(8, 7),
      new Position(12, 14),
      new Position(8, 9),
    ];

    playStones(omok, positions);
    omok.board.view();

    expect(omok.board.getStoneCount()).toBe(positions.length);
    expect(omok.getGeumsu().samsam).toContainEqual(new Position(7, 8));

    const undo = 4;

    for (let i = 0; i < undo; i += 1) {
      omok.undo();
    }

    const expected = [new Position(7, 8)];

    expect(omok.board.getStoneCount()).toBe(positions.length - undo);
    const result = omok.getGeumsu().samsam;
    expect(result).toHaveLength(expected.length);
    for (let i = 0; i < expected.length; i += 1) {
      expect(result).toContainEqual(expected[i]);
    }
  });

  test('undo test 2, 4*4 금수가 해금 되는지', () => {
    const positions = [
      new Position(7, 7),
      new Position(7, 10),
      new Position(7, 8),
      new Position(4, 6),
      new Position(7, 9),
      new Position(7, 4),
      new Position(8, 6),
      new Position(10, 6),
      new Position(9, 6),
      new Position(14, 14),
      new Position(6, 6),
    ];

    playStones(omok, positions);

    expect(omok.board.getStoneCount()).toBe(positions.length);
    expect(omok.getGeumsu().sasa).toContainEqual(new Position(7, 6));
    const undo = 1;

    for (let i = 0; i < undo; i += 1) {
      omok.undo();
    }

    expect(omok.board.getStoneCount()).toBe(positions.length - undo);
    const result = omok.getGeumsu().sasa;

    expect(result).toEqual([]);
  });
});
