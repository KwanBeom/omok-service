import Omok from '@/app/_omok/Omok';
import { Position } from '@/app/_omok/types';

describe('금수 테스트', () => {
  test('장목(6목) 테스트', () => {
    const omok = new Omok();

    const pos: Position[] = [
      [7, 7],
      [0, 0],
      [7, 8],
      [0, 1],
      [7, 9],
      [0, 2],
      [7, 5],
      [0, 14],
      [7, 4],
      [0, 13],
      [6, 10],
      [0, 12],
      [9, 7],
      [0, 10],
      [10, 6],
      [0, 9],
      [11, 5],
      [0, 8],
      [8, 5],
      [0, 6],
      [9, 5],
      [0, 5],
      [6, 5],
      [1, 14],
      [13, 9],
      [2, 14],
      [13, 14],
      [1, 0],
      [13, 10],
      [2, 0],
      [13, 13],
      [1, 2],
      [13, 11],
    ];

    for (let i = 0; i < pos.length; i += 1) {
      omok.play(pos[i]);
    }

    expect(omok.getGeumsu().jangmok).toEqual([
      [7, 6],
      [8, 8],
      [10, 5],
      [13, 12],
    ]);
  });
});
