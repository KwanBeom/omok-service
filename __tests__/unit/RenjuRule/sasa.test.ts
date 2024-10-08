import Omok from '@/app/_omok/core/Omok';
import Position from '@/app/_omok/entities/Position';
import playStones from '../../utils/utils';

describe('44 금수 test', () => {
  let omok: Omok;

  beforeEach(() => {
    omok = new Omok();
  });

  test('낀 3, 이은 3 교점 4*4', () => {
    const positions = [
      new Position(7, 7),
      new Position(8, 8),
      new Position(8, 7),
      new Position(7, 6),
      new Position(9, 7),
      new Position(10, 7),
      new Position(8, 9),
      new Position(8, 10),
      new Position(5, 6),
      new Position(5, 8),
      new Position(7, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([new Position(6, 7)]);
  });

  test('한 방향 2칸 띄워 낀 위치에 4*4 1', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(7, 10),
      new Position(13, 14),
      new Position(5, 9),
      new Position(12, 14),
      new Position(8, 9),
      new Position(11, 14),
      new Position(6, 9),
      new Position(14, 13),
      new Position(7, 6),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([new Position(7, 9)]);
  });

  test('한 방향 2칸 띄워 낀 위치에 4*4 2', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(7, 11),
      new Position(13, 14),
      new Position(4, 9),
      new Position(12, 14),
      new Position(3, 9),
      new Position(11, 14),
      new Position(7, 8),
      new Position(14, 13),
      new Position(5, 9),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([new Position(7, 9)]);
  });

  test('두 방향 2칸 띄워 낀 위치 4*4 1', () => {
    const positions = [
      new Position(7, 6),
      new Position(14, 14),
      new Position(7, 7),
      new Position(13, 14),
      new Position(4, 9),
      new Position(12, 14),
      new Position(5, 9),
      new Position(11, 14),
      new Position(7, 10),
      new Position(14, 13),
      new Position(8, 9),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([new Position(7, 9)]);
  });

  test('두 방향 2칸 띄워 낀 위치 4*4 2', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(7, 11),
      new Position(13, 14),
      new Position(4, 9),
      new Position(12, 14),
      new Position(5, 9),
      new Position(11, 14),
      new Position(7, 8),
      new Position(14, 13),
      new Position(8, 9),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([new Position(7, 9)]);
  });

  test('두 방향이 중간에 한 칸씩 총 2칸 띈 4*4', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(7, 5),
      new Position(13, 14),
      new Position(4, 6),
      new Position(12, 14),
      new Position(6, 6),
      new Position(11, 14),
      new Position(8, 6),
      new Position(14, 13),
      new Position(7, 9),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([new Position(7, 6)]);
  });

  test('띈 4*4', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(7, 9),
      new Position(13, 14),
      new Position(4, 8),
      new Position(12, 14),
      new Position(3, 9),
      new Position(11, 14),
      new Position(5, 7),
      new Position(14, 13),
      new Position(7, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([new Position(7, 5)]);
  });

  test('기본 4*4 1', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(8, 10),
      new Position(13, 14),
      new Position(9, 11),
      new Position(14, 13),
      new Position(7, 6),
      new Position(12, 14),
      new Position(7, 8),
      new Position(14, 12),
      new Position(10, 12),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([new Position(7, 9)]);
  });

  test('기본 4*4 2', () => {
    const positions = [
      new Position(2, 2),
      new Position(14, 14),
      new Position(1, 1),
      new Position(14, 13),
      new Position(0, 0),
      new Position(14, 12),
      new Position(3, 2),
      new Position(13, 14),
      new Position(3, 0),
      new Position(12, 14),
      new Position(3, 1),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([new Position(3, 3)]);
  });

  test('모든 3이 직접 방어되어 있는 4*4', () => {
    const positions = [
      new Position(7, 7),
      new Position(7, 6),
      new Position(7, 9),
      new Position(3, 8),
      new Position(6, 8),
      new Position(14, 14),
      new Position(4, 8),
      new Position(13, 14),
      new Position(7, 10),
      new Position(14, 13),
      new Position(5, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([new Position(7, 8)]);
  });

  test('낀 4, 띈 4가 만나는 4*4 1', () => {
    const positions = [
      new Position(0, 6),
      new Position(14, 14),
      new Position(1, 6),
      new Position(13, 14),
      new Position(2, 6),
      new Position(12, 14),
      new Position(4, 5),
      new Position(14, 13),
      new Position(4, 8),
      new Position(14, 12),
      new Position(4, 9),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([new Position(4, 6)]);
  });

  test('낀 4, 띈 4가 만나는 4*4 2', () => {
    const positions = [
      new Position(12, 0),
      new Position(14, 14),
      new Position(9, 3),
      new Position(13, 14),
      new Position(9, 5),
      new Position(12, 14),
      new Position(10, 6),
      new Position(14, 13),
      new Position(7, 3),
      new Position(14, 12),
      new Position(10, 2),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([new Position(8, 4)]);
  });

  test('낀 4 2개가 만나는 4*4', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(9, 7),
      new Position(13, 14),
      new Position(7, 8),
      new Position(12, 14),
      new Position(9, 6),
      new Position(14, 13),
      new Position(10, 7),
      new Position(14, 12),
      new Position(10, 5),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([new Position(8, 7)]);
  });

  test('한 방향만 1칸 띈 4*4', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(9, 5),
      new Position(13, 14),
      new Position(8, 10),
      new Position(12, 14),
      new Position(9, 11),
      new Position(14, 13),
      new Position(10, 12),
      new Position(14, 12),
      new Position(8, 6),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([new Position(6, 8)]);
  });

  test('1칸 띈 4*4', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(9, 7),
      new Position(13, 14),
      new Position(10, 7),
      new Position(12, 14),
      new Position(6, 11),
      new Position(14, 12),
      new Position(6, 8),
      new Position(14, 11),
      new Position(6, 9),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([new Position(6, 7)]);
  });

  test('O OXO O 모양 4*4, 수순 1', () => {
    const positions = [
      new Position(7, 6),
      new Position(7, 3),
      new Position(7, 4),
      new Position(7, 11),
      new Position(7, 10),
      new Position(14, 14),
      new Position(7, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([new Position(7, 7)]);
  });

  test('O OXO O 모양 4*4, 수순 2', () => {
    const positions = [
      new Position(7, 8),
      new Position(14, 14),
      new Position(7, 10),
      new Position(14, 0),
      new Position(7, 4),
      new Position(14, 13),
      new Position(7, 6),
      new Position(14, 12),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([new Position(7, 7)]);
  });

  test('특수 형태 4*4, OVXOOVO', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(7, 8),
      new Position(13, 14),
      new Position(7, 10),
      new Position(12, 14),
      new Position(7, 4),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([new Position(7, 6)]);
  });

  test('특수 형태 4*4, OOVXOVOO', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(7, 9),
      new Position(13, 14),
      new Position(7, 10),
      new Position(12, 14),
      new Position(7, 4),
      new Position(11, 14),
      new Position(7, 3),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([new Position(7, 6)]);
  });

  test('4*4 교점의 한 방향이 간접 막혀있어 금수가 아닌 경우', () => {
    const positions = [
      new Position(7, 7),
      new Position(7, 9),
      new Position(8, 9),
      new Position(14, 14),
      new Position(6, 7),
      new Position(13, 14),
      new Position(7, 6),
      new Position(12, 14),
      new Position(9, 10),
      new Position(14, 13),
      new Position(7, 5),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([]);
  });

  test('4*4 직접막기 해금', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(7, 10),
      new Position(13, 14),
      new Position(9, 9),
      new Position(12, 14),
      new Position(10, 9),
      new Position(14, 13),
      new Position(7, 8),
      new Position(14, 12),
      new Position(8, 9),
      new Position(7, 9),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([]);
  });

  test('4*4 간접막기 해금', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(7, 10),
      new Position(13, 14),
      new Position(9, 9),
      new Position(12, 14),
      new Position(10, 9),
      new Position(14, 13),
      new Position(7, 8),
      new Position(14, 12),
      new Position(8, 9),
      new Position(6, 9),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([]);
  });

  test('4*4 금수지만 5목을 만들 수 있어 아닌 경우', () => {
    const positions = [
      new Position(7, 7),
      new Position(7, 11),
      new Position(7, 8),
      new Position(11, 10),
      new Position(8, 7),
      new Position(14, 14),
      new Position(10, 9),
      new Position(13, 14),
      new Position(6, 5),
      new Position(14, 13),
      new Position(7, 5),
      new Position(12, 14),
      new Position(8, 6),
      new Position(14, 12),
      new Position(6, 6),
      new Position(13, 13),
      new Position(9, 6),
      new Position(10, 6),
      new Position(5, 6),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).not.toContainEqual(new Position(7, 6));
  });
});
