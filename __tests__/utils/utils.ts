import Omok from '@/app/_omok/core/Omok';
import Position from '@/app/_omok/entities/Position';

export default function playStones(omok: Omok, positions: Position[]) {
  for (let i = 0; i < positions.length; i += 1) {
    omok.play(positions[i]);
  }

  return omok;
}
