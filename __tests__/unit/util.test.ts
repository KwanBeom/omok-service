import { createPosition, getDistance } from '@/app/_omok/utils';

describe('utility function tests', () => {
  test('getDistance test', () => {
    const result = getDistance(createPosition(7, 7), createPosition(7, 9));

    expect(result).toBe(2);
  });
});
