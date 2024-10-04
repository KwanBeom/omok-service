import Omok from '@/app/_omok/Omok';
import { createPosition } from '@/app/_omok/utils';
import playStones from '../../_utils/test.utils';

describe('장목 금수 test', () => {
  let omok: Omok;

  beforeEach(() => {
    omok = new Omok();
  });

  test('가로 장목 1', () => {
    const positions = [
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

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().jangmok).toEqual([createPosition(7, 8)]);
  });

  test('가로 장목 2', () => {
    const positions = [
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

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().jangmok).toEqual([createPosition(8, 8)]);
  });

  test('세로 장목', () => {
    const positions = [
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

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().jangmok).toEqual([createPosition(8, 7)]);
  });

  test('대각 장목', () => {
    const positions = [
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

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().jangmok).toEqual([createPosition(4, 10)]);
  });

  test('6목 이상 장목', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(7, 10),
      createPosition(14, 13),
      createPosition(7, 11),
      createPosition(14, 12),
      createPosition(7, 6),
      createPosition(13, 14),
      createPosition(7, 5),
      createPosition(12, 14),
      createPosition(7, 4),
      createPosition(7, 3),
      createPosition(7, 9),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().jangmok).toEqual([createPosition(7, 8)]);
  });
});
