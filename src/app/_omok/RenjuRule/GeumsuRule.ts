import Board from '../Board';
import { Position } from '../utils';

type GeumsuPositions = Position[];

abstract class GeumsuRule {
  /** 룰 적용 */
  abstract apply(board: Board, position: Position): GeumsuPositions;
  /** position이 금수 위치인지 확인하는 함수 */
  abstract check(board: Board, position: Position): boolean;
}

export default GeumsuRule;
