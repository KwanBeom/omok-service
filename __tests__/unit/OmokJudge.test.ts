import Omok from '../../server/omok/core/Omok';
import Position from '../../server/omok/entities/Position';
import OmokJudge from '../../server/omok/core/OmokJudge';
import { RenjuRule } from '../../server/omok/core/RenjuRule';
import Board from '../../server/omok/core/Board';

describe('오목 돌 5개 이어 승리하는 테스트 케이스', () => {
  const rule = new RenjuRule();
  const judge = new OmokJudge(rule);
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  test('흑돌 가로 5 승리', () => {
    const positions = [
      new Position(7, 7),
      new Position(0, 0),
      new Position(7, 8),
      new Position(0, 1),
      new Position(7, 9),
      new Position(0, 2),
      new Position(7, 10),
      new Position(0, 3),
      new Position(7, 11),
    ];

    for (let i = 0; i < positions.length; i += 1) {
      board.dropStone(positions[i], i % 2 === 0 ? 'black' : 'white');
    }

    expect(judge.checkWin(board, positions[positions.length - 1])).toBe(true);
  });

  test('흑돌 대각 5 승리', () => {
    const positions = [
      new Position(7, 7),
      new Position(0, 0),
      new Position(8, 8),
      new Position(0, 1),
      new Position(9, 9),
      new Position(0, 2),
      new Position(10, 10),
      new Position(0, 3),
      new Position(11, 11),
    ];

    for (let i = 0; i < positions.length; i += 1) {
      board.dropStone(positions[i], i % 2 === 0 ? 'black' : 'white');
    }

    expect(judge.checkWin(board, positions[positions.length - 1])).toBe(true);
  });

  test('백돌 가로 5 승리', () => {
    const positions = [
      new Position(0, 0),
      new Position(7, 7),
      new Position(0, 1),
      new Position(7, 8),
      new Position(0, 2),
      new Position(7, 9),
      new Position(0, 3),
      new Position(7, 10),
      new Position(0, 4),
      new Position(7, 11),
    ];

    for (let i = 0; i < positions.length; i += 1) {
      board.dropStone(positions[i], i % 2 === 0 ? 'black' : 'white');
    }

    expect(judge.checkWin(board, positions[positions.length - 1])).toBe(true);
  });

  test('백돌 대각 5 승리', () => {
    const positions = [
      new Position(0, 0),
      new Position(7, 7),
      new Position(0, 1),
      new Position(8, 8),
      new Position(0, 2),
      new Position(9, 9),
      new Position(0, 3),
      new Position(10, 10),
      new Position(0, 5),
      new Position(11, 11),
    ];

    for (let i = 0; i < positions.length; i += 1) {
      board.dropStone(positions[i], i % 2 === 0 ? 'black' : 'white');
    }

    expect(judge.checkWin(board, positions[positions.length - 1])).toBe(true);
  });
});
