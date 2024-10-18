import Board from '@/app/_omok/core/Board';
import Omok from '@/app/_omok/core/Omok';
import Position, { IPosition } from '@/app/_omok/entities/Position';

export default function playStones(omok: Omok, positions: Position[]) {
  for (let i = 0; i < positions.length; i += 1) {
    omok.play(positions[i].x, positions[i].y);
  }

  return omok;
}

export function extractPositions(data: { position: any }[]) {
  return data.map((v) => v.position);
}

export function dropStoneToBoard(board: Board, positions: IPosition[]) {
  for (let i = 0; i < positions.length; i += 1) {
    board.dropStone(positions[i], i % 2 === 0 ? 'black' : 'white');
  }

  return board;
}
