import Stone from '../entities/Stone';

/** 게임의 진행을 관리하는 클래스 */
class HistoryManager {
  private moves: Stone[] = [];

  addMove(stone: Stone) {
    this.moves.push(stone);
  }

  undoMove() {
    return this.moves.pop();
  }

  getLastMove() {
    return this.moves[this.moves.length - 1];
  }

  getCount() {
    return this.moves.length;
  }
}

export default HistoryManager;
