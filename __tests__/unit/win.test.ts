import Omok from '@/app/_omok/core/Omok';
import Position from '@/app/_omok/entities/Position';
import playStones from '../utils/utils';

describe('오목 돌 5개 이어 승리하는 테스트 케이스', () => {
  let omok: Omok;

  beforeEach(() => {
    omok = new Omok();
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

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.checkWin()).toBe(true);
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

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.checkWin()).toBe(true);
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

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.checkWin()).toBe(true);
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

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.checkWin()).toBe(true);
  });
});
