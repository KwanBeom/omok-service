import Omok from '@/app/_omok/core/Omok';
import Position from '@/app/_omok/entities/Position';
import playStones from '../../utils/utils';

describe('3*3 금수 테스트', () => {
  let omok: Omok;

  beforeEach(() => {
    omok = new Omok();
  });

  test('한 방향만 1칸 띈 3*3 1', () => {
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

    expect(omokAfterPlay.getGeumsu().samsam).toContainEqual(new Position(7, 7));
  });

  test('한 방향만 1칸 띈 3*3 2', () => {
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

    expect(omokAfterPlay.getGeumsu().samsam).toContainEqual(new Position(8, 7));
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

    expect(omokAfterPlay.getGeumsu().samsam).toContainEqual(new Position(6, 7));
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

    expect(omokAfterPlay.getGeumsu().samsam).toContainEqual(new Position(5, 9));
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

    expect(omokAfterPlay.getGeumsu().samsam).toContainEqual(new Position(6, 8));
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

    expect(omokAfterPlay.getGeumsu().samsam).toStrictEqual([]);
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

    expect(omokAfterPlay.getGeumsu().samsam).toStrictEqual([]);
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

    expect(omokAfterPlay.getGeumsu().samsam).toContainEqual(new Position(6, 7));
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

    expect(omokAfterPlay.getGeumsu().samsam).toStrictEqual([]);
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

    expect(omokAfterPlay.getGeumsu().samsam).toStrictEqual([]);
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

    expect(omokAfterPlay.getGeumsu().samsam).toContainEqual(new Position(7, 7));
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

    expect(omokAfterPlay.getGeumsu().samsam).toContainEqual(new Position(7, 7));
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

    expect(omokAfterPlay.getGeumsu().samsam).toContainEqual(new Position(7, 8));
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

    expect(omokAfterPlay.getGeumsu().samsam).toContainEqual(new Position(7, 8));
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

    expect(omokAfterPlay.getGeumsu().samsam).toStrictEqual([]);
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

    expect(omokAfterPlay.getGeumsu().samsam).toStrictEqual([]);
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

    expect(omokAfterPlay.getGeumsu().samsam).toStrictEqual([]);
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

  test('3*3 금수 위치였으나 백의 방어로 아닌 경우', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(7, 10),
      new Position(14, 13),
      new Position(8, 9),
      new Position(13, 14),
      new Position(6, 9),
      new Position(13, 13),
      new Position(9, 9),
      new Position(7, 9),
      new Position(8, 11),
      new Position(9, 12),
      new Position(8, 10),
      new Position(8, 8),
    ];

    playStones(omok, positions);

    expect(omok.getGeumsu().samsam).not.toContainEqual(new Position(10, 10));
  });
});

describe('진행마다 3*3 금수가 거짓금수와 함께 잘 동작하는지 테스트', () => {
  const testCases = [
    {
      positions: [
        new Position(7, 7),
        new Position(14, 14),
        new Position(7, 9),
        new Position(14, 12),
        new Position(8, 7),
        new Position(14, 13),
        new Position(8, 9),
        new Position(13, 14),
        new Position(9, 8),
        new Position(13, 13),
        new Position(6, 8),
        new Position(13, 12),
      ],
      expectGeumsu: [
        new Position(5, 7),
        new Position(5, 9),
        new Position(7, 6),
        new Position(8, 6),
        new Position(7, 8),
        new Position(8, 8),
        new Position(7, 10),
        new Position(8, 10),
        new Position(10, 7),
        new Position(10, 9),
      ],
      description: '첫번째 금수 판별 테스트',
    },

    {
      positions: [new Position(9, 6)],
      expectGeumsu: [
        new Position(9, 7),
        new Position(10, 7),
        new Position(9, 9),
        new Position(10, 9),
        new Position(8, 10),
        new Position(8, 6),
        new Position(7, 8),
        new Position(5, 9),
        new Position(5, 7),
      ],
      description: '두번째 금수 판별 테스트',
    },
  ];

  const omok = new Omok();

  test.each(testCases)('$description', ({ positions, expectGeumsu }) => {
    playStones(omok, positions);
    const result = omok.getGeumsu();

    expect(result.samsam).toHaveLength(expectGeumsu.length);

    expectGeumsu.forEach((position) => {
      expect(result.samsam).toContainEqual(position);
    });
  });
});

describe('3*3 금수 통합 테스트', () => {
  let omok: Omok;

  beforeEach(() => {
    omok = new Omok();
  });

  test('3*3 통합 테스트 1', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 1),
      new Position(7, 9),
      new Position(14, 0),
      new Position(6, 8),
      new Position(13, 0),
      new Position(8, 8),
      new Position(13, 1),
      new Position(8, 9),
      new Position(14, 2),
      new Position(6, 7),
      new Position(12, 0),
    ];

    const expected = [
      new Position(6, 6),
      new Position(5, 7),
      new Position(5, 9),
      new Position(6, 10),
      new Position(7, 8),
      new Position(8, 7),
      new Position(6, 9),
      new Position(8, 6),
      new Position(9, 7),
      new Position(9, 9),
      new Position(8, 10),
    ];

    playStones(omok, positions);
    const result = omok.getGeumsu();

    for (let i = 0; i < expected.length; i += 1) {
      expect(result.samsam).toContainEqual(expected[i]);
    }
  });
  test('3*3 거짓 금수 테스트 2', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 0),
      new Position(5, 7),
      new Position(14, 1),
      new Position(7, 9),
      new Position(14, 2),
      new Position(8, 6),
      new Position(13, 0),
      new Position(5, 9),
      new Position(14, 3),
      new Position(8, 8),
      new Position(13, 1),
      new Position(4, 8),
      new Position(13, 2),
      new Position(4, 6),
    ];

    const expected = [
      new Position(4, 7),
      new Position(4, 9),
      new Position(6, 6),
      new Position(8, 7),
      new Position(8, 9),
      new Position(6, 10),
    ];

    playStones(omok, positions);
    const result = omok.getGeumsu();

    for (let i = 0; i < expected.length; i += 1) {
      expect(result.samsam).toContainEqual(expected[i]);
    }
  });
  test('3*3 거짓 금수 테스트 3', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(8, 7),
      new Position(13, 14),
      new Position(8, 10),
      new Position(14, 13),
      new Position(7, 10),
      new Position(13, 13),
      new Position(8, 4),
      new Position(14, 12),
      new Position(7, 4),
      new Position(13, 12),
      new Position(6, 6),
      new Position(14, 11),
      new Position(9, 6),
      new Position(12, 13),
      new Position(6, 9),
      new Position(12, 14),
      new Position(9, 9),
    ];

    const expected = [
      new Position(10, 7),
      new Position(9, 7),
      new Position(8, 6),
      new Position(8, 5),
      new Position(7, 5),
      new Position(7, 6),
      new Position(6, 7),
      new Position(5, 7),
    ];

    playStones(omok, positions);
    const result = omok.getGeumsu();

    expect(result.samsam).toHaveLength(expected.length);

    for (let i = 0; i < expected.length; i += 1) {
      expect(result.samsam).toContainEqual(expected[i]);
    }
  });
  test('3*3 거짓 금수 테스트 4', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(8, 8),
      new Position(14, 13),
      new Position(8, 9),
      new Position(13, 14),
      new Position(9, 7),
      new Position(12, 14),
      new Position(7, 10),
      new Position(13, 13),
      new Position(6, 9),
      new Position(14, 12),
      new Position(10, 8),
    ];

    const expected = [
      new Position(8, 6),
      new Position(8, 7),
      new Position(10, 7),
      new Position(9, 8),
      new Position(7, 9),
      new Position(8, 11),
    ];

    playStones(omok, positions);
    const result = omok.getGeumsu();

    expect(result.samsam).toHaveLength(expected.length);

    for (let i = 0; i < expected.length; i += 1) {
      expect(result.samsam).toContainEqual(expected[i]);
    }
  });
  test('3*3 거짓 금수 테스트 5', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(8, 9),
      new Position(13, 14),
      new Position(6, 10),
      new Position(14, 13),
      new Position(5, 8),
      new Position(13, 13),
      new Position(4, 6),
      new Position(14, 12),
      new Position(6, 5),
      new Position(12, 14),
      new Position(4, 7),
      new Position(13, 12),
      new Position(5, 9),
      new Position(12, 13),
      new Position(7, 6),
      new Position(14, 11),
      new Position(8, 8),
    ];

    const expected = [
      new Position(4, 8),
      new Position(4, 9),
      new Position(5, 6),
      new Position(5, 7),
      new Position(6, 7),
      new Position(6, 8),
      new Position(7, 8),
      new Position(7, 9),
      new Position(8, 6),
      new Position(8, 7),
    ];

    playStones(omok, positions);
    const result = omok.getGeumsu();

    expect(result.samsam).toHaveLength(expected.length);

    for (let i = 0; i < expected.length; i += 1) {
      expect(result.samsam).toContainEqual(expected[i]);
    }
  });
  test('3*3 거짓 금수 테스트 6', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(8, 9),
      new Position(13, 14),
      new Position(6, 10),
      new Position(14, 13),
      new Position(5, 8),
      new Position(13, 13),
      new Position(4, 6),
      new Position(14, 12),
      new Position(6, 5),
      new Position(12, 14),
      new Position(4, 7),
      new Position(13, 12),
      new Position(5, 9),
      new Position(12, 13),
      new Position(7, 6),
      new Position(14, 11),
      new Position(8, 8),
    ];

    const expected = [
      new Position(4, 8),
      new Position(4, 9),
      new Position(5, 6),
      new Position(5, 7),
      new Position(6, 7),
      new Position(6, 8),
      new Position(7, 8),
      new Position(7, 9),
      new Position(8, 6),
      new Position(8, 7),
    ];

    playStones(omok, positions);
    const result = omok.getGeumsu();

    expect(result.samsam).toHaveLength(expected.length);

    for (let i = 0; i < expected.length; i += 1) {
      expect(result.samsam).toContainEqual(expected[i]);
    }
  });

  test('3*3 거짓 금수 테스트 8', () => {
    const positions = [
      new Position(7, 7),
      new Position(14, 14),
      new Position(8, 7),
      new Position(14, 13),
      new Position(8, 9),
      new Position(13, 14),
      new Position(7, 9),
      new Position(14, 12),
      new Position(8, 5),
      new Position(13, 13),
      new Position(7, 5),
      new Position(13, 12),
      new Position(9, 6),
      new Position(12, 14),
      new Position(9, 8),
      new Position(12, 13),
      new Position(6, 6),
      new Position(12, 12),
      new Position(6, 8),
      new Position(11, 14),
    ];

    const expected = [
      new Position(5, 5),
      new Position(6, 5),
      new Position(5, 7),
      new Position(6, 7),
      new Position(5, 9),
      new Position(6, 9),
      new Position(9, 5),
      new Position(10, 5),
      new Position(9, 7),
      new Position(10, 7),
      new Position(9, 9),
      new Position(10, 9),
    ];

    playStones(omok, positions);
    const result = omok.getGeumsu();

    expect(result.samsam).toHaveLength(expected.length);

    for (let i = 0; i < expected.length; i += 1) {
      expect(result.samsam).toContainEqual(expected[i]);
    }
  });
});
