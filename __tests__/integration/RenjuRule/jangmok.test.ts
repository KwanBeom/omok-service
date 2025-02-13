import Position from '../../../server/omok/entities/Position';
import JangmokRule from '../../../server/omok/core/RenjuRule/JangmokRule';
import Board from '../../../server/omok/core/Board';
import { dropStoneToBoard } from '../../utils/utils';

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
  test('양 옆이 막혀있는 6목', () => {
    const positions = [
      new Position(7, 7),
      new Position(7, 4),
      new Position(7, 5),
      new Position(14, 0),
      new Position(7, 6),
      new Position(14, 14),
      new Position(7, 9),
      new Position(7, 11),
      new Position(7, 10),
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
    jangmokRule.apply(board, positions[positions.length - 1]);
    const result = jangmokRule.haegeum(board);
    expect(result).not.toContainEqual(new Position(7, 8));
  });
});
