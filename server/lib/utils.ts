import { BLACK, WHITE } from '../constants/player';
import { STONE } from '../types/stone';

/** 랜덤하게 섞인 [흑돌, 백돌] 배열 얻기 */
// eslint-disable-next-line import/prefer-default-export
export const getShuffledStones = () => [BLACK, WHITE].sort(() => Math.random() - 0.5) as STONE[];
