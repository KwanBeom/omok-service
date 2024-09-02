import Omok from '@/app/_omok/Omok';

describe('오목 돌 5개 이어 승리하는 테스트 케이스', () => {
  test('흑돌 가로 5 승리', () => {
    const omok = new Omok();

    omok.play(7, 7);
    omok.play(0, 0);
    omok.play(7, 8);
    omok.play(0, 1);
    omok.play(7, 9);
    omok.play(0, 2);
    omok.play(7, 10);
    omok.play(0, 3);

    expect(omok.checkWin()).toBe(true);
  });

  test('흑돌 대각 5 승리', () => {
    const omok = new Omok();

    omok.play(7, 7);
    omok.play(0, 0);
    omok.play(8, 8);
    omok.play(0, 1);
    omok.play(9, 9);
    omok.play(0, 2);
    omok.play(10, 10);
    omok.play(0, 3);
    omok.play(11, 11);

    expect(omok.checkWin()).toBe(true);
  });

  test('백돌 가로 5 승리', () => {
    const omok = new Omok();

    omok.play(0, 0);
    omok.play(7, 7);
    omok.play(0, 1);
    omok.play(7, 8);
    omok.play(0, 2);
    omok.play(7, 9);
    omok.play(0, 3);
    omok.play(7, 10);
    omok.play(0, 4);
    omok.play(7, 11);

    expect(omok.checkWin()).toBe(true);
  });

  test('백돌 대각 5 승리', () => {
    const omok = new Omok();

    omok.play(0, 0);
    omok.play(7, 7);
    omok.play(0, 1);
    omok.play(8, 8);
    omok.play(0, 2);
    omok.play(9, 9);
    omok.play(0, 3);
    omok.play(10, 10);
    omok.play(0, 5);
    omok.play(11, 11);

    expect(omok.checkWin()).toBe(true);
  });
});
