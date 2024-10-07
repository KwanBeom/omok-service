import Omok from '@/app/_omok/Omok';
import { createPosition } from '@/app/_omok/utils';
import playStones from '../../_utils/test.utils';

describe('33 금수 test', () => {
  let omok: Omok;

  beforeEach(() => {
    omok = new Omok();
  });

  test('한 방향만 1칸 띈 3*3', () => {
    const positions = [
      createPosition(8, 8),
      createPosition(14, 14),
      createPosition(9, 9),
      createPosition(14, 13),
      createPosition(7, 4),
      createPosition(14, 0),
      createPosition(7, 5),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([createPosition(7, 7)]);
  });

  test('기본 모양 3*3', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 0),
      createPosition(8, 7),
      createPosition(14, 14),
      createPosition(6, 9),
      createPosition(14, 13),
      createPosition(6, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([createPosition(6, 7)]);
  });

  test('한 방향만 1칸 띈 3*3', () => {
    const positions = [
      createPosition(9, 7),
      createPosition(14, 0),
      createPosition(10, 7),
      createPosition(14, 1),
      createPosition(7, 6),
      createPosition(14, 2),
      createPosition(5, 4),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([createPosition(8, 7)]);
  });

  test('띈 3*3 모양', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 0),
      createPosition(8, 6),
      createPosition(14, 1),
      createPosition(5, 11),
      createPosition(14, 2),
      createPosition(5, 12),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([createPosition(5, 9)]);
  });

  test('삿갓(ㅅ) 모양 3*3', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 0),
      createPosition(8, 6),
      createPosition(14, 1),
      createPosition(7, 9),
      createPosition(14, 2),
      createPosition(8, 10),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([createPosition(6, 8)]);
  });

  test('한 방향이 직접 막힌 경우', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(7, 8),
      createPosition(7, 6),
      createPosition(14, 14),
      createPosition(8, 5),
      createPosition(14, 13),
      createPosition(9, 5),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([]);
  });

  test('한 방향이 간접 막힌 경우', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(7, 8),
      createPosition(7, 5),
      createPosition(8, 6),
      createPosition(14, 13),
      createPosition(9, 6),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([]);
  });

  test('양방향 중간에 1칸 띈 3*3', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(9, 7),
      createPosition(13, 14),
      createPosition(6, 10),
      createPosition(12, 14),
      createPosition(6, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([createPosition(6, 7)]);
  });

  test('띈 3 위치가 간접 막힌 경우', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(7, 8),
      createPosition(7, 4),
      createPosition(9, 5),
      createPosition(14, 13),
      createPosition(8, 5),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([]);
  });

  test('띈 3 위치가 직접 막힌 경우', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(9, 7),
      createPosition(6, 11),
      createPosition(6, 10),
      createPosition(13, 14),
      createPosition(6, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([]);
  });

  test('낀 3*3', () => {
    const positions = [
      createPosition(7, 8),
      createPosition(14, 14),
      createPosition(7, 6),
      createPosition(14, 13),
      createPosition(8, 7),
      createPosition(14, 12),
      createPosition(9, 7),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([createPosition(7, 7)]);
  });

  test('띄워져 있는 낀 3*3', () => {
    const positions = [
      createPosition(7, 5),
      createPosition(14, 14),
      createPosition(7, 8),
      createPosition(14, 13),
      createPosition(10, 7),
      createPosition(14, 12),
      createPosition(8, 7),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([createPosition(7, 7)]);
  });

  test('하나만 띄워져 있는 낀 3*3', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(7, 10),
      createPosition(14, 13),
      createPosition(9, 8),
      createPosition(13, 14),
      createPosition(8, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([createPosition(7, 8)]);
  });

  test('열린 2가 3개 겹치는 3*3', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 1),
      createPosition(7, 9),
      createPosition(14, 2),
      createPosition(9, 10),
      createPosition(14, 3),
      createPosition(10, 11),
      createPosition(13, 0),
      createPosition(6, 8),
      createPosition(13, 1),
      createPosition(4, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([createPosition(7, 8), createPosition(7, 8)]);
  });

  test('4*3 위치가 3*3으로 판단되는지 테스트', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 0),
      createPosition(7, 9),
      createPosition(14, 1),
      createPosition(7, 6),
      createPosition(14, 2),
      createPosition(8, 5),
      createPosition(13, 0),
      createPosition(9, 5),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([]);
  });

  test('3*3 간접막기 해금 테스트', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 0),
      createPosition(7, 8),
      createPosition(14, 1),
      createPosition(8, 9),
      createPosition(14, 2),
      createPosition(9, 9),
      createPosition(7, 10),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([]);
  });

  test('3*3 직접막기 해금 테스트', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 0),
      createPosition(7, 10),
      createPosition(14, 1),
      createPosition(10, 8),
      createPosition(14, 2),
      createPosition(8, 8),
      createPosition(7, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([]);
  });

  test('칸수가 부족해 3*3 금수가 아닌 경우', () => {
    const positions = [
      createPosition(12, 1),
      createPosition(14, 14),
      createPosition(11, 1),
      createPosition(13, 14),
      createPosition(12, 3),
      createPosition(14, 13),
      createPosition(13, 3),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([]);
  });

  test('3*3 금수지만 5목을 만들 수 있어 아닌 경우', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(6, 8),
      createPosition(13, 14),
      createPosition(9, 7),
      createPosition(14, 13),
      createPosition(10, 8),
      createPosition(14, 12),
      createPosition(8, 5),
      createPosition(13, 13),
      createPosition(8, 8),
      createPosition(12, 14),
      createPosition(8, 9),
      createPosition(11, 14),
      createPosition(8, 7),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).not.toContainEqual(createPosition(8, 6));
  });
});
