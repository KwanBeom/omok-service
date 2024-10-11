import Omok from '@/app/_omok/core/Omok';
import Position from '@/app/_omok/entities/Position';
import playStones from '../../utils/utils';

describe('거짓 금수 테스트', () => {
  let omok: Omok;

  beforeEach(() => {
    omok = new Omok();
  });

  test('3*3 금수위치이나 양쪽 모두 장목이어서 거짓금수인 경우', () => {
    const positions = [
      new Position(7, 7),
      new Position(7, 11),
      new Position(5, 7),
      new Position(13, 14),
      new Position(4, 8),
      new Position(14, 14),
      new Position(7, 10),
      new Position(5, 8),
      new Position(7, 2),
      new Position(5, 9),
      new Position(7, 6),
    ];

    playStones(omok, positions);

    expect(omok.getGeumsu().samsam).not.toContainEqual(new Position(7, 5));
  });

  test('3*3 금수위치이나 띈 3으로 4를 만들 때 44 금수가 되는 거짓금수', () => {
    const positions = [
      new Position(7, 7),
      new Position(7, 8),
      new Position(8, 7),
      new Position(6, 7),
      new Position(5, 6),
      new Position(8, 6),
      new Position(6, 8),
      new Position(5, 7),
      new Position(7, 6),
      new Position(6, 4),
      new Position(7, 5),
      new Position(7, 4),
      new Position(4, 6),
      new Position(5, 4),
      new Position(8, 4),
      new Position(6, 3),
      new Position(8, 5),
      new Position(5, 2),
      new Position(4, 5),
      new Position(3, 6),
      new Position(6, 6),
      new Position(3, 4),
    ];

    playStones(omok, positions);
    expect(omok.getGeumsu().samsam).not.toContainEqual(new Position(4, 4));
  });

  test('3*3 금수위치이나 양쪽 각각 장목, 44 금수로 인한 거짓금수 1', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(6, 7),
      new Position(3, 10),
      new Position(4, 9),
      new Position(13, 14),
      new Position(8, 5),
      new Position(14, 13),
      new Position(7, 12),
      new Position(13, 13),
      new Position(7, 9),
      new Position(8, 9),
      new Position(9, 8),
      new Position(8, 10),
      new Position(10, 9),
      new Position(8, 12),
      new Position(11, 10),
      new Position(14, 12),
      new Position(4, 11),
      new Position(12, 14),
      new Position(5, 10),
    ];

    playStones(omok, positions);

    expect(omok.getGeumsu().samsam).not.toContainEqual(new Position(7, 8));
  });

  test('3*3 금수위치이나 양쪽 각각 장목, 44 금수로 인한 거짓금수 2', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(9, 7),
      new Position(11, 9),
      new Position(10, 8),
      new Position(9, 8),
      new Position(8, 6),
      new Position(10, 9),
      new Position(6, 6),
      new Position(11, 8),
      new Position(5, 7),
      new Position(3, 9),
      new Position(4, 8),
      new Position(10, 7),
      new Position(7, 8),
      new Position(7, 12),
      new Position(7, 11),
    ];

    playStones(omok, positions);

    expect(omok.getGeumsu().samsam).not.toContainEqual(new Position(7, 6));
  });

  test('3*3 금수위치이나 양쪽 각각 장목, 한쪽은 33 금수로 인한 거짓금수', () => {
    const positions = [
      new Position(7, 7),
      new Position(8, 7),
      new Position(7, 9),
      new Position(7, 13),
      new Position(7, 12),
      new Position(6, 12),
      new Position(6, 6),
      new Position(6, 13),
      new Position(8, 6),
      new Position(6, 8),
      new Position(5, 10),
      new Position(5, 12),
      new Position(8, 9),
      new Position(8, 8),
      new Position(9, 10),
      new Position(6, 9),
      new Position(5, 11),
      new Position(9, 9),
      new Position(8, 5),
      new Position(9, 7),
      new Position(9, 4),
    ];

    playStones(omok, positions);

    expect(omok.getGeumsu().samsam).not.toContainEqual(new Position(7, 8));
  });

  test('3*3 금수위치가 하나의 수로 한쪽은 3*3 금수, 한쪽은 6목으로 인한 거짓금수로 해금 되는 경우', () => {
    const positions = [
      new Position(7, 7),
      new Position(7, 8),
      new Position(9, 7),
      new Position(9, 8),
      new Position(8, 7),
      new Position(10, 7),
      new Position(9, 6),
      new Position(10, 5),
      new Position(9, 5),
      new Position(9, 4),
      new Position(8, 5),
      new Position(7, 4),
      new Position(7, 5),
      new Position(6, 5),
      new Position(10, 8),
      new Position(7, 6),
      new Position(9, 9),
      new Position(5, 6),
      new Position(8, 10),
      new Position(7, 11),
      new Position(11, 7),
      new Position(12, 6),
    ];

    const geumsuPosition = new Position(8, 6);

    playStones(omok, positions);

    expect(omok.getGeumsu().samsam).toContainEqual(geumsuPosition);

    omok.play(new Position(5, 7));

    expect(omok.getGeumsu().samsam).not.toContainEqual(geumsuPosition);
  });

  test('띈 3 중 하나가 다음 수순에 4*4 금수가 되어 3*3 위치가 거짓금수인 경우', () => {
    const positions = [
      new Position(7, 7),
      new Position(6, 8),
      new Position(7, 8),
      new Position(7, 10),
      new Position(6, 9),
      new Position(9, 9),
      new Position(8, 6),
      new Position(8, 10),
      new Position(7, 9),
      new Position(8, 5),
      new Position(6, 6),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).not.toContainEqual(new Position(9, 6));
  });

  test('이은 2 OO 2개가 만나는 형태에, 하나의 3이 다음 수순에 4*4 금수가 되는 경우', () => {
    const positions = [
      new Position(7, 7),
      new Position(6, 7),
      new Position(6, 6),
      new Position(8, 8),
      new Position(7, 8),
      new Position(7, 6),
      new Position(8, 5),
      new Position(8, 7),
      new Position(7, 4),
      new Position(6, 5),
      new Position(5, 4),
      new Position(9, 7),
      new Position(9, 6),
      new Position(10, 7),
      new Position(9, 4),
      new Position(11, 7),
      new Position(12, 7),
      new Position(11, 5),
      new Position(10, 6),
      new Position(11, 6),
      new Position(11, 4),
      new Position(12, 5),
      new Position(9, 8),
      new Position(9, 3),
      new Position(9, 5),
      new Position(8, 2),
      new Position(7, 1),
      new Position(6, 3),
      new Position(12, 6),
      new Position(6, 4),
      new Position(9, 2),
      new Position(7, 3),
      new Position(10, 3),
      new Position(6, 1),
      new Position(6, 2),
      new Position(4, 6),
      new Position(5, 5),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).not.toContainEqual(new Position(5, 3));
  });

  test('띈 2 OVVO 형태에, 낀 위치에 3*3 금수가 있으나 4를 만들 때 4*4 금수로 인한 거짓금수 1', () => {
    const positions = [
      new Position(7, 7),
      new Position(7, 8),
      new Position(7, 9),
      new Position(6, 9),
      new Position(6, 8),
      new Position(9, 6),
      new Position(8, 7),
      new Position(7, 6),
      new Position(9, 7),
      new Position(6, 7),
      new Position(8, 9),
      new Position(6, 6),
      new Position(10, 6),
      new Position(5, 6),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).not.toContainEqual(new Position(8, 6));
  });

  test('띈 2 OVVO 형태에, 낀 위치에 3*3 금수가 있으나 4를 만들 때 4*4 금수로 인한 거짓금수 2', () => {
    const positions = [
      new Position(7, 7),
      new Position(8, 8),
      new Position(7, 5),
      new Position(7, 6),
      new Position(8, 6),
      new Position(9, 5),
      new Position(9, 7),
      new Position(6, 4),
      new Position(10, 7),
      new Position(8, 7),
      new Position(10, 8),
      new Position(11, 9),
      new Position(10, 9),
      new Position(10, 10),
      new Position(11, 8),
      new Position(12, 8),
      new Position(9, 11),
      new Position(9, 10),
      new Position(6, 8),
      new Position(11, 10),
      new Position(8, 10),
      new Position(7, 9),
      new Position(5, 9),
      new Position(4, 10),
      new Position(7, 11),
      new Position(11, 7),
      new Position(10, 6),
      new Position(10, 5),
      new Position(6, 10),
      new Position(8, 12),
      new Position(4, 8),
      new Position(3, 7),
      new Position(6, 9),
      new Position(6, 11),
      new Position(5, 8),
      new Position(3, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).not.toContainEqual(new Position(5, 7));
  });

  test('이은 2(OO)가 한 방향은 간접 방어이고 열린 방향이 3*3 금수이나 다음 수순에 이은 4로 4*4 금수가 되는 경우', () => {
    const positions = [
      new Position(7, 6),
      new Position(6, 8),
      new Position(7, 8),
      new Position(6, 9),
      new Position(8, 5),
      new Position(10, 3),
      new Position(8, 9),
      new Position(6, 10),
      new Position(5, 9),
      new Position(5, 13),
      new Position(5, 10),
      new Position(14, 14),
      new Position(5, 11),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).not.toContainEqual(new Position(6, 7));
  });

  test('띈 2(OVO) 형태에, 낀 위치가 3*3 금수이나 한 방향은 간접 방어되어 있고 열린 방향으로 이은 4를 만들 때 4*4 금수가 되는 경우', () => {
    const positions = [
      new Position(7, 7),
      new Position(7, 5),
      new Position(7, 9),
      new Position(14, 14),
      new Position(8, 10),
      new Position(13, 14),
      new Position(10, 10),
      new Position(11, 10),
      new Position(6, 10),
      new Position(14, 13),
      new Position(8, 8),
      new Position(14, 0),
      new Position(9, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).not.toContainEqual(new Position(7, 8));
  });

  test('교점에 거짓 금수 조건이 성립하나, 3*3을 만드는 2가 2개 이상이어서 금수 조건인 경우', () => {
    const positions = [
      new Position(7, 7),
      new Position(10, 7),
      new Position(8, 7),
      new Position(14, 14),
      new Position(6, 8),
      new Position(13, 14),
      new Position(6, 9),
      new Position(14, 13),
      new Position(5, 6),
      new Position(14, 12),
      new Position(5, 5),
      new Position(13, 13),
      new Position(5, 4),
      new Position(5, 3),
      new Position(8, 5),
      new Position(12, 14),
      new Position(9, 4),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toContainEqual(new Position(6, 7));
  });

  test('3의 양방향이 간접 막혀있어 열린 4를 만들지 못해 3*3 금수가 아닌 경우 1', () => {
    const positions = [
      new Position(7, 7),
      new Position(7, 5),
      new Position(7, 9),
      new Position(7, 11),
      new Position(9, 8),
      new Position(14, 14),
      new Position(10, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([]);
  });

  test('3의 양방향이 간접 막혀있어 열린 4를 만들지 못해 3*3 금수가 아닌 경우 2', () => {
    const positions = [
      new Position(7, 7),
      new Position(8, 4),
      new Position(8, 8),
      new Position(8, 10),
      new Position(9, 7),
      new Position(14, 0),
      new Position(8, 6),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([]);
  });

  test('3의 양방향이 간접 막혀있어 열린 4를 만들지 못해 3*3 금수가 아닌 경우 3', () => {
    const positions = [
      new Position(11, 11),
      new Position(9, 9),
      new Position(12, 12),
      new Position(7, 14),
      new Position(13, 11),
      new Position(7, 13),
      new Position(13, 12),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([]);
  });

  test('4*4 금수 위치이나 하나의 4가 다음 수순에 6목인 경우 1', () => {
    const positions = [
      new Position(7, 7),
      new Position(8, 8),
      new Position(8, 7),
      new Position(7, 6),
      new Position(9, 7),
      new Position(10, 7),
      new Position(5, 6),
      new Position(5, 8),
      new Position(6, 5),
      new Position(6, 9),
      new Position(8, 9),
      new Position(8, 10),
      new Position(7, 8),
      new Position(9, 10),
      new Position(4, 7),
      new Position(3, 8),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([]);
  });

  test('4*4 금수 위치이나 하나의 4가 다음 수순에 6목인 경우 2', () => {
    const positions = [
      new Position(7, 7),
      new Position(7, 6),
      new Position(7, 8),
      new Position(14, 14),
      new Position(7, 9),
      new Position(13, 14),
      new Position(4, 10),
      new Position(3, 10),
      new Position(7, 12),
      new Position(14, 13),
      new Position(6, 10),
      new Position(13, 13),
      new Position(5, 10),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().sasa).toEqual([]);
  });

  test('3*3 금수 모양이나 한쪽은 백 간접 방어, 한쪽은 장목 금수인 경우 1', () => {
    const positions = [
      new Position(7, 7),
      new Position(7, 10),
      new Position(6, 8),
      new Position(14, 10),
      new Position(5, 8),
      new Position(14, 1),
      new Position(7, 3),
      new Position(14, 2),
      new Position(7, 6),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([]);
  });

  test('3*3 금수 모양이나 한쪽은 백 간접 방어, 한쪽은 장목 금수인 경우 2', () => {
    const positions = [
      new Position(7, 7),
      new Position(10, 4),
      new Position(3, 11),
      new Position(14, 14),
      new Position(7, 6),
      new Position(13, 14),
      new Position(6, 8),
      new Position(14, 13),
      new Position(6, 6),
    ];

    const omokAfterPlay = playStones(omok, positions);

    expect(omokAfterPlay.getGeumsu().samsam).toEqual([]);
  });
});
