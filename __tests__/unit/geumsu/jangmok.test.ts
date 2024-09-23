import Omok from '@/app/_omok/Omok';
import { createPosition } from '@/app/_omok/utils';

describe('장목(6목) 테스트', () => {
  test('가로 장목', () => {
    const omok = new Omok();

    const pos = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(7, 12),
      createPosition(13, 14),
      createPosition(7, 10),
      createPosition(14, 13),
      createPosition(7, 9),
      createPosition(14, 12),
      createPosition(7, 11),
    ];

    for (let i = 0; i < pos.length; i += 1) {
      omok.play(pos[i]);
    }

    expect(omok.getGeumsu().jangmok).toEqual([createPosition(7, 8)]);
  });
  test('가로 장목', () => {
    const omok = new Omok();

    const pos = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(9, 9),
      createPosition(13, 14),
      createPosition(10, 10),
      createPosition(12, 14),
      createPosition(6, 6),
      createPosition(11, 14),
      createPosition(11, 11),
    ];

    for (let i = 0; i < pos.length; i += 1) {
      omok.play(pos[i]);
    }

    expect(omok.getGeumsu().jangmok).toEqual([createPosition(8, 8)]);
  });

  test('세로 장목', () => {
    const omok = new Omok();

    const pos = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(9, 7),
      createPosition(14, 13),
      createPosition(12, 7),
      createPosition(13, 14),
      createPosition(11, 7),
      createPosition(12, 14),
      createPosition(10, 7),
    ];

    for (let i = 0; i < pos.length; i += 1) {
      omok.play(pos[i]);
    }

    expect(omok.getGeumsu().jangmok).toEqual([createPosition(8, 7)]);
  });

  test('대각 장목', () => {
    const omok = new Omok();

    const pos = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(2, 12),
      createPosition(14, 13),
      createPosition(5, 9),
      createPosition(13, 14),
      createPosition(3, 11),
      createPosition(14, 11),
      createPosition(6, 8),
    ];

    for (let i = 0; i < pos.length; i += 1) {
      omok.play(pos[i]);
    }

    expect(omok.getGeumsu().jangmok).toEqual([createPosition(4, 10)]);
  });
});
