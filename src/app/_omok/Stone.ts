export type StoneColor = 'black' | 'white';

export type StonePoint = (typeof STONE)['BLACK']['POINT'] | (typeof STONE)['WHITE']['POINT'];

export const STONE = {
  BLACK: { POINT: 1, TEXT: 'black' },
  WHITE: { POINT: 2, TEXT: 'white' },
} as const;
