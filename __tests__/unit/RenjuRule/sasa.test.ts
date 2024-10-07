import Omok from '@/app/_omok/Omok';
import { createPosition } from '@/app/_omok/utils';
import playStones from '../../_utils/test.utils';

describe('44 금수 test', () => {
  let omok: Omok;

  beforeEach(() => {
    omok = new Omok();
  });

  test('낀 3, 이은 3 교점 4*4', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(8, 8),
      createPosition(8, 7),
      createPosition(7, 6),
      createPosition(9, 7),
      createPosition(10, 7),
      createPosition(8, 9),
      createPosition(8, 10),
      createPosition(5, 6),
      createPosition(5, 8),
      createPosition(7, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([createPosition(6, 7)]);
  });

  test('한 방향 2칸 띄워 낀 위치에 4*4 1', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(7, 10),
      createPosition(13, 14),
      createPosition(5, 9),
      createPosition(12, 14),
      createPosition(8, 9),
      createPosition(11, 14),
      createPosition(6, 9),
      createPosition(14, 13),
      createPosition(7, 6),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([createPosition(7, 9)]);
  });

  test('한 방향 2칸 띄워 낀 위치에 4*4 2', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(7, 11),
      createPosition(13, 14),
      createPosition(4, 9),
      createPosition(12, 14),
      createPosition(3, 9),
      createPosition(11, 14),
      createPosition(7, 8),
      createPosition(14, 13),
      createPosition(5, 9),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([createPosition(7, 9)]);
  });

  test('두 방향 2칸 띄워 낀 위치 4*4 1', () => {
    const positions = [
      createPosition(7, 6),
      createPosition(14, 14),
      createPosition(7, 7),
      createPosition(13, 14),
      createPosition(4, 9),
      createPosition(12, 14),
      createPosition(5, 9),
      createPosition(11, 14),
      createPosition(7, 10),
      createPosition(14, 13),
      createPosition(8, 9),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([createPosition(7, 9)]);
  });

  test('두 방향 2칸 띄워 낀 위치 4*4 2', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(7, 11),
      createPosition(13, 14),
      createPosition(4, 9),
      createPosition(12, 14),
      createPosition(5, 9),
      createPosition(11, 14),
      createPosition(7, 8),
      createPosition(14, 13),
      createPosition(8, 9),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([createPosition(7, 9)]);
  });

  test('두 방향이 중간에 한 칸씩 총 2칸 띈 4*4', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(7, 5),
      createPosition(13, 14),
      createPosition(4, 6),
      createPosition(12, 14),
      createPosition(6, 6),
      createPosition(11, 14),
      createPosition(8, 6),
      createPosition(14, 13),
      createPosition(7, 9),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([createPosition(7, 6)]);
  });

  test('띈 4*4', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(7, 9),
      createPosition(13, 14),
      createPosition(4, 8),
      createPosition(12, 14),
      createPosition(3, 9),
      createPosition(11, 14),
      createPosition(5, 7),
      createPosition(14, 13),
      createPosition(7, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([createPosition(7, 5)]);
  });

  test('기본 4*4 1', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(8, 10),
      createPosition(13, 14),
      createPosition(9, 11),
      createPosition(14, 13),
      createPosition(7, 6),
      createPosition(12, 14),
      createPosition(7, 8),
      createPosition(14, 12),
      createPosition(10, 12),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([createPosition(7, 9)]);
  });

  test('기본 4*4 2', () => {
    const positions = [
      createPosition(2, 2),
      createPosition(14, 14),
      createPosition(1, 1),
      createPosition(14, 13),
      createPosition(0, 0),
      createPosition(14, 12),
      createPosition(3, 2),
      createPosition(13, 14),
      createPosition(3, 0),
      createPosition(12, 14),
      createPosition(3, 1),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([createPosition(3, 3)]);
  });

  test('모든 3이 직접 방어되어 있는 4*4', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(7, 6),
      createPosition(7, 9),
      createPosition(3, 8),
      createPosition(6, 8),
      createPosition(14, 14),
      createPosition(4, 8),
      createPosition(13, 14),
      createPosition(7, 10),
      createPosition(14, 13),
      createPosition(5, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([createPosition(7, 8)]);
  });

  test('낀 4, 띈 4가 만나는 4*4 1', () => {
    const positions = [
      createPosition(0, 6),
      createPosition(14, 14),
      createPosition(1, 6),
      createPosition(13, 14),
      createPosition(2, 6),
      createPosition(12, 14),
      createPosition(4, 5),
      createPosition(14, 13),
      createPosition(4, 8),
      createPosition(14, 12),
      createPosition(4, 9),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([createPosition(4, 6)]);
  });

  test('낀 4, 띈 4가 만나는 4*4 2', () => {
    const positions = [
      createPosition(12, 0),
      createPosition(14, 14),
      createPosition(9, 3),
      createPosition(13, 14),
      createPosition(9, 5),
      createPosition(12, 14),
      createPosition(10, 6),
      createPosition(14, 13),
      createPosition(7, 3),
      createPosition(14, 12),
      createPosition(10, 2),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([createPosition(8, 4)]);
  });

  test('낀 4 2개가 만나는 4*4', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(9, 7),
      createPosition(13, 14),
      createPosition(7, 8),
      createPosition(12, 14),
      createPosition(9, 6),
      createPosition(14, 13),
      createPosition(10, 7),
      createPosition(14, 12),
      createPosition(10, 5),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([createPosition(8, 7)]);
  });

  test('한 방향만 1칸 띈 4*4', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(9, 5),
      createPosition(13, 14),
      createPosition(8, 10),
      createPosition(12, 14),
      createPosition(9, 11),
      createPosition(14, 13),
      createPosition(10, 12),
      createPosition(14, 12),
      createPosition(8, 6),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([createPosition(6, 8)]);
  });

  test('1칸 띈 4*4', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(9, 7),
      createPosition(13, 14),
      createPosition(10, 7),
      createPosition(12, 14),
      createPosition(6, 11),
      createPosition(14, 12),
      createPosition(6, 8),
      createPosition(14, 11),
      createPosition(6, 9),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([createPosition(6, 7)]);
  });

  test('O OXO O 모양 4*4, 수순 1', () => {
    const positions = [
      createPosition(7, 6),
      createPosition(7, 3),
      createPosition(7, 4),
      createPosition(7, 11),
      createPosition(7, 10),
      createPosition(14, 14),
      createPosition(7, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([createPosition(7, 7)]);
  });

  test('O OXO O 모양 4*4, 수순 2', () => {
    const positions = [
      createPosition(7, 8),
      createPosition(14, 14),
      createPosition(7, 10),
      createPosition(14, 0),
      createPosition(7, 4),
      createPosition(14, 13),
      createPosition(7, 6),
      createPosition(14, 12),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([createPosition(7, 7)]);
  });

  test('특수 형태 4*4, OVXOOVO', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(7, 8),
      createPosition(13, 14),
      createPosition(7, 10),
      createPosition(12, 14),
      createPosition(7, 4),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([createPosition(7, 6)]);
  });

  test('특수 형태 4*4, OOVXOVOO', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(7, 9),
      createPosition(13, 14),
      createPosition(7, 10),
      createPosition(12, 14),
      createPosition(7, 4),
      createPosition(11, 14),
      createPosition(7, 3),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([createPosition(7, 6)]);
  });

  test('4*4 교점의 한 방향이 간접 막혀있어 금수가 아닌 경우', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(7, 9),
      createPosition(8, 9),
      createPosition(14, 14),
      createPosition(6, 7),
      createPosition(13, 14),
      createPosition(7, 6),
      createPosition(12, 14),
      createPosition(9, 10),
      createPosition(14, 13),
      createPosition(7, 5),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([]);
  });

  test('4*4 직접막기 해금', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(7, 10),
      createPosition(13, 14),
      createPosition(9, 9),
      createPosition(12, 14),
      createPosition(10, 9),
      createPosition(14, 13),
      createPosition(7, 8),
      createPosition(14, 12),
      createPosition(8, 9),
      createPosition(7, 9),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([]);
  });

  test('4*4 간접막기 해금', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(14, 14),
      createPosition(7, 10),
      createPosition(13, 14),
      createPosition(9, 9),
      createPosition(12, 14),
      createPosition(10, 9),
      createPosition(14, 13),
      createPosition(7, 8),
      createPosition(14, 12),
      createPosition(8, 9),
      createPosition(6, 9),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([]);
  });

  test('4*4 금수지만 5목을 만들 수 있어 아닌 경우', () => {
    const positions = [
      createPosition(7, 7),
      createPosition(7, 11),
      createPosition(7, 8),
      createPosition(11, 10),
      createPosition(8, 7),
      createPosition(14, 14),
      createPosition(10, 9),
      createPosition(13, 14),
      createPosition(6, 5),
      createPosition(14, 13),
      createPosition(7, 5),
      createPosition(12, 14),
      createPosition(8, 6),
      createPosition(14, 12),
      createPosition(6, 6),
      createPosition(13, 13),
      createPosition(9, 6),
      createPosition(10, 6),
      createPosition(5, 6),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).not.toContainEqual(createPosition(7, 6));
  });
});
