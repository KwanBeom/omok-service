import Omok from '@/app/_omok/Omok';
import { POINT_BLACK } from '@/app/_omok/Stone';
import { countStones, view } from '@/app/_omok/utils';

describe('유틸 함수 테스트', () => {
  test('돌 갯수 카운팅 함수 테스트', () => {
    const omok = new Omok();

    omok.play([7, 7]);
    omok.play([0, 0]);
    omok.play([7, 8]);
    omok.play([0, 1]);
    omok.play([7, 9]);
    omok.play([0, 2]);
    omok.play([7, 10]);
    omok.play([0, 3]);
    omok.play([7, 11]);
    view(omok.getBoard());

    const result = countStones(omok.getBoard(), [7, 11], [0, -1], POINT_BLACK);

    expect(result).toBe(5);
  });
});
