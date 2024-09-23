import Omok from '@/app/_omok/Omok';
import { createPosition } from '@/app/_omok/utils';

describe('오목 돌 5개 이어 승리하는 테스트 케이스', () => {
  test('흑돌 가로 5 승리', () => {
    const omok = new Omok();
    const pos = [
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

    for (let i = 0; i < pos.length; i += 1) {
      omok.play(pos[i]);
    }

    expect(omok.checkWin()).toBe(true);
  });

  test('흑돌 대각 5 승리', () => {
    const omok = new Omok();
    const pos = [
      createPosition(7, 7),
      createPosition(0, 0),
      createPosition(8, 8),
      createPosition(0, 1),
      createPosition(9, 9),
      createPosition(0, 2),
      createPosition(10, 10),
      createPosition(0, 3),
      createPosition(11, 11),
    ];

    for (let i = 0; i < pos.length; i += 1) {
      omok.play(pos[i]);
    }
    expect(omok.checkWin()).toBe(true);
  });

  test('백돌 가로 5 승리', () => {
    const omok = new Omok();
    const pos = [
      createPosition(0, 0),
      createPosition(7, 7),
      createPosition(0, 1),
      createPosition(7, 8),
      createPosition(0, 2),
      createPosition(7, 9),
      createPosition(0, 3),
      createPosition(7, 10),
      createPosition(0, 4),
      createPosition(7, 11),
    ];

    for (let i = 0; i < pos.length; i += 1) {
      omok.play(pos[i]);
    }

    expect(omok.checkWin()).toBe(true);
  });

  test('백돌 대각 5 승리', () => {
    const omok = new Omok();
    const pos = [
      createPosition(0, 0),
      createPosition(7, 7),
      createPosition(0, 1),
      createPosition(8, 8),
      createPosition(0, 2),
      createPosition(9, 9),
      createPosition(0, 3),
      createPosition(10, 10),
      createPosition(0, 5),
      createPosition(11, 11),
    ];

    for (let i = 0; i < pos.length; i += 1) {
      omok.play(pos[i]);
    }

    expect(omok.checkWin()).toBe(true);
  });
});
