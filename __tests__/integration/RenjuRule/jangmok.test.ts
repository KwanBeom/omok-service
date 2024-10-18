import Omok from '@/app/_omok/core/Omok';
import Position from '@/app/_omok/entities/Position';
import playStones, { dropStoneToBoard } from '../../utils/utils';
import JangmokRule from '@/app/_omok/core/RenjuRule/JangmokRule';
import Board from '@/app/_omok/core/Board';

describe('장목 금수 test', () => {
  let jangmokRule: JangmokRule;
  let board: Board;

  beforeEach(() => {
    jangmokRule = new JangmokRule();
    board = new Board();
  });

  test('가로 장목 1', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(7, 12),
      new Position(13, 14),
      new Position(7, 10),
      new Position(14, 13),
      new Position(7, 9),
      new Position(14, 12),
      new Position(7, 11),
    ];

    dropStoneToBoard(board, positions);
    expect(jangmokRule.apply(board, positions[positions.length - 1])).toContainEqual(
      new Position(7, 8),
    );
  });

  test('가로 장목 2', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(9, 9),
      new Position(13, 14),
      new Position(10, 10),
      new Position(12, 14),
      new Position(6, 6),
      new Position(11, 14),
      new Position(11, 11),
    ];

    dropStoneToBoard(board, positions);
    expect(jangmokRule.apply(board, positions[positions.length - 1])).toContainEqual(
      new Position(8, 8),
    );
  });

  test('세로 장목', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(9, 7),
      new Position(14, 13),
      new Position(12, 7),
      new Position(13, 14),
      new Position(11, 7),
      new Position(12, 14),
      new Position(10, 7),
    ];

    dropStoneToBoard(board, positions);
    expect(jangmokRule.apply(board, positions[positions.length - 1])).toContainEqual(
      new Position(8, 7),
    );
  });

  test('대각 장목', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(2, 12),
      new Position(14, 13),
      new Position(5, 9),
      new Position(13, 14),
      new Position(3, 11),
      new Position(14, 11),
      new Position(6, 8),
    ];

    dropStoneToBoard(board, positions);
    expect(jangmokRule.apply(board, positions[positions.length - 1])).toContainEqual(
      new Position(4, 10),
    );
  });

  test('6목 이상 장목', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(7, 10),
      new Position(14, 13),
      new Position(7, 11),
      new Position(14, 12),
      new Position(7, 6),
      new Position(13, 14),
      new Position(7, 5),
      new Position(12, 14),
      new Position(7, 4),
      new Position(7, 3),
      new Position(7, 9),
    ];

    dropStoneToBoard(board, positions);
    expect(jangmokRule.apply(board, positions[positions.length - 1])).toContainEqual(
      new Position(7, 8),
    );
  });

  test('장목 금수이지만 5목을 만들 수 있어 아닌 경우', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(7, 9),
      new Position(13, 14),
      new Position(7, 10),
      new Position(14, 13),
      new Position(7, 11),
      new Position(13, 13),
      new Position(7, 12),
      new Position(12, 14),
      new Position(8, 8),
      new Position(14, 12),
      new Position(9, 8),
      new Position(11, 14),
      new Position(10, 8),
      new Position(14, 11),
      new Position(11, 8),
    ];

    dropStoneToBoard(board, positions);
    expect(jangmokRule.apply(board, positions[positions.length - 1])).not.toContainEqual(
      new Position(7, 8),
    );
  });

  test('장목 금수 아닌 경우', () => {
    const positions = [
      new Position(7, 7),
      new Position(6, 7),
      new Position(6, 6),
      new Position(8, 8),
      new Position(7, 8),
      new Position(7, 6),
      new Position(8, 5),
      new Position(8, 7),
      new Position(7, 4),
      new Position(6, 5),
      new Position(5, 4),
      new Position(9, 7),
      new Position(9, 6),
      new Position(10, 7),
      new Position(9, 4),
      new Position(11, 7),
      new Position(12, 7),
      new Position(11, 5),
      new Position(10, 6),
      new Position(11, 6),
      new Position(11, 4),
      new Position(12, 5),
      new Position(9, 8),
      new Position(9, 3),
      new Position(9, 5),
      new Position(8, 2),
      new Position(7, 1),
      new Position(6, 3),
      new Position(12, 6),
      new Position(6, 4),
      new Position(9, 2),
    ];

    dropStoneToBoard(board, positions);
    expect(jangmokRule.apply(board, positions[positions.length - 1])).not.toContainEqual(
      new Position(9, 1),
    );
  });
});
