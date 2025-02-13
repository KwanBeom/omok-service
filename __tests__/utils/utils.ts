import Board from '../../server/omok/core/Board';
import Omok from '../../server/omok/core/Omok';
import { RenjuRule } from '../../server/omok/core/RenjuRule';
import SamsamRule from '../../server/omok/core/RenjuRule/SamsamRule';
import Position, { IPosition } from '../../server/omok/entities/Position';

export function playStones(omok: Omok, positions: Position[]) {
  for (let i = 0; i < positions.length; i += 1) {
    omok.play(positions[i].x, positions[i].y);
  }

  return omok;
}

export function extractPositions(data: { position: IPosition }[]) {
  return data.map((v) => v.position);
}

export function dropStoneToBoard(board: Board, positions: IPosition[]) {
  for (let i = 0; i < positions.length; i += 1) {
    board.dropStone(positions[i], i % 2 === 0 ? 'black' : 'white');
  }

  return board;
}
/** 렌주룰 적용한 결과를 반환 */
export function dropStoneToBoardAndApplyRenjuRule(
  board: Board,
  renjuRule: RenjuRule,
  positions: IPosition[],
) {
  for (let i = 0; i < positions.length; i += 1) {
    board.dropStone(positions[i], i % 2 === 0 ? 'black' : 'white');
    renjuRule.apply(board, positions[i]);
  }

  return renjuRule.apply(board, positions[positions.length - 1]);
}

export function dropStoneToBoardAndApplySamsamRule(
  board: Board,
  samsamRule: SamsamRule,
  positions: IPosition[],
) {
  for (let i = 0; i < positions.length; i += 1) {
    board.dropStone(positions[i], i % 2 === 0 ? 'black' : 'white');
    samsamRule.apply(board, positions[i]);
  }

  return extractPositions(samsamRule.apply(board, positions[positions.length - 1]));
}
