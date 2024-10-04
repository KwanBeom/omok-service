import Omok from '@/app/_omok/Omok';
import { Position } from '@/app/_omok/utils';

export default function playStones(omok: Omok, positions: Position[]) {
  for (let i = 0; i < positions.length; i += 1) {
    omok.play(positions[i]);
  }

  return omok;
}
