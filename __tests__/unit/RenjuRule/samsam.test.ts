import Omok from '@/app/_omok/core/Omok';
import Position from '@/app/_omok/entities/Position';
import playStones from '../../utils/utils';

describe('33 금수 test', () => {
  let omok: Omok;

  beforeEach(() => {
    omok = new Omok();
  });

  test('한 방향만 1칸 띈 3*3', () => {
    const positions = [
      new Position(8, 8),
      new Position(14, 14),
      new Position(9, 9),
      new Position(14, 13),
      new Position(7, 4),
      new Position(14, 0),
      new Position(7, 5),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([new Position(7, 7)]);
  });

  test('기본 모양 3*3', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 0),
      new Position(8, 7),
      new Position(14, 14),
      new Position(6, 9),
      new Position(14, 13),
      new Position(6, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([new Position(6, 7)]);
  });

  test('한 방향만 1칸 띈 3*3', () => {
    const positions = [
      new Position(9, 7),
      new Position(14, 0),
      new Position(10, 7),
      new Position(14, 1),
      new Position(7, 6),
      new Position(14, 2),
      new Position(5, 4),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([new Position(8, 7)]);
  });

  test('띈 3*3 모양', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 0),
      new Position(8, 6),
      new Position(14, 1),
      new Position(5, 11),
      new Position(14, 2),
      new Position(5, 12),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([new Position(5, 9)]);
  });

  test('삿갓(ㅅ) 모양 3*3', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 0),
      new Position(8, 6),
      new Position(14, 1),
      new Position(7, 9),
      new Position(14, 2),
      new Position(8, 10),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([new Position(6, 8)]);
  });

  test('한 방향이 직접 막힌 경우', () => {
    const positions = [
      new Position(7, 7),
      new Position(7, 8),
      new Position(7, 6),
      new Position(14, 14),
      new Position(8, 5),
      new Position(14, 13),
      new Position(9, 5),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([]);
  });

  test('한 방향이 간접 막힌 경우', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(7, 8),
      new Position(7, 5),
      new Position(8, 6),
      new Position(14, 13),
      new Position(9, 6),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([]);
  });

  test('양방향 중간에 1칸 띈 3*3', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(9, 7),
      new Position(13, 14),
      new Position(6, 10),
      new Position(12, 14),
      new Position(6, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([new Position(6, 7)]);
  });

  test('띈 3 위치가 간접 막힌 경우', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(7, 8),
      new Position(7, 4),
      new Position(9, 5),
      new Position(14, 13),
      new Position(8, 5),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([]);
  });

  test('띈 3 위치가 직접 막힌 경우', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(9, 7),
      new Position(6, 11),
      new Position(6, 10),
      new Position(13, 14),
      new Position(6, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([]);
  });

  test('낀 3*3', () => {
    const positions = [
      new Position(7, 8),
      new Position(14, 14),
      new Position(7, 6),
      new Position(14, 13),
      new Position(8, 7),
      new Position(14, 12),
      new Position(9, 7),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([new Position(7, 7)]);
  });

  test('띄워져 있는 낀 3*3', () => {
    const positions = [
      new Position(7, 5),
      new Position(14, 14),
      new Position(7, 8),
      new Position(14, 13),
      new Position(10, 7),
      new Position(14, 12),
      new Position(8, 7),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([new Position(7, 7)]);
  });

  test('하나만 띄워져 있는 낀 3*3', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(7, 10),
      new Position(14, 13),
      new Position(9, 8),
      new Position(13, 14),
      new Position(8, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([new Position(7, 8)]);
  });

  test('열린 2가 3개 겹치는 3*3', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 1),
      new Position(7, 9),
      new Position(14, 2),
      new Position(9, 10),
      new Position(14, 3),
      new Position(10, 11),
      new Position(13, 0),
      new Position(6, 8),
      new Position(13, 1),
      new Position(4, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([new Position(7, 8), new Position(7, 8)]);
  });

  test('4*3 위치가 3*3으로 판단되는지 테스트 1', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 0),
      new Position(7, 9),
      new Position(14, 1),
      new Position(7, 6),
      new Position(14, 2),
      new Position(8, 5),
      new Position(13, 0),
      new Position(9, 5),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).not.toContainEqual(new Position(7, 5));
  });

  test('4*3 위치가 3*3으로 판단되는지 테스트 2', () => {
    const positions = [
      new Position(7, 7),
      new Position(8, 8),
      new Position(5, 9),
      new Position(8, 6),
      new Position(4, 10),
      new Position(8, 9),
      new Position(8, 10),
      new Position(4, 9),
      new Position(7, 9),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).not.toContainEqual(new Position(6, 8));
  });

  test('3*3 간접막기 해금 테스트', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 0),
      new Position(7, 8),
      new Position(14, 1),
      new Position(8, 9),
      new Position(14, 2),
      new Position(9, 9),
      new Position(7, 10),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([]);
  });

  test('3*3 직접막기 해금 테스트', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 0),
      new Position(7, 10),
      new Position(14, 1),
      new Position(10, 8),
      new Position(14, 2),
      new Position(8, 8),
      new Position(7, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([]);
  });

  test('칸수가 부족해 3*3 금수가 아닌 경우', () => {
    const positions = [
      new Position(12, 1),
      new Position(14, 14),
      new Position(11, 1),
      new Position(13, 14),
      new Position(12, 3),
      new Position(14, 13),
      new Position(13, 3),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([]);
  });

  test('3*3 금수지만 5목을 만들 수 있어 아닌 경우', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(6, 8),
      new Position(13, 14),
      new Position(9, 7),
      new Position(14, 13),
      new Position(10, 8),
      new Position(14, 12),
      new Position(8, 5),
      new Position(13, 13),
      new Position(8, 8),
      new Position(12, 14),
      new Position(8, 9),
      new Position(11, 14),
      new Position(8, 7),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).not.toContainEqual(new Position(8, 6));
  });

  test('4*3 위치가 3*3으로 판별되는지 테스트', () => {
    const positions = [
      new Position(7, 7),
      new Position(7, 8),
      new Position(8, 6),
      new Position(6, 8),
      new Position(9, 5),
      new Position(6, 7),
      new Position(8, 4),
      new Position(8, 5),
      new Position(10, 7),
      new Position(9, 6),
      new Position(10, 8),
      new Position(9, 7),
      new Position(10, 4),
    ];

    playStones(omok, positions);

    expect(omok.getGeumsu().samsam).not.toContainEqual(new Position(10, 6));
  });
});
