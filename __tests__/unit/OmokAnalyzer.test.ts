import OmokAnalyzer from '@/app/_omok/core/OmokAnalyzer';
import Position, { PositionTuple } from '@/app/_omok/entities/Position';
import Board from '@/app/_omok/core/Board';

describe('OmokAnalyzer tests', () => {
  let board: Board;

  const initialPositions: PositionTuple<2> = [new Position(7, 7), new Position(7, 8)];

  beforeEach(() => {
    board = new Board();
    for (let i = 0; i < initialPositions.length; i += 1) {
      board.dropStone(initialPositions[i], 'black');
    }
  });

  test('getSkippedPosition test', () => {
    const positions: PositionTuple<3> = [...initialPositions, new Position(7, 10)]; // 새로운 배열로 사용
    const skippedPosition = OmokAnalyzer.getSkippedPosition(positions);
    expect(skippedPosition).toContainEqual(new Position(7, 9));
  });

  test('checkOpenTwo test', () => {
    const positions: PositionTuple<2> = [...initialPositions]; // 새로운 배열로 사용
    const isOpenTwo = OmokAnalyzer.checkOpenTwo(board, positions);
    expect(isOpenTwo).toBe(true);

    board.dropStone(new Position(7, 9), 'white');

    const isOpenTwoAfterBlock = OmokAnalyzer.checkOpenTwo(board, positions);
    expect(isOpenTwoAfterBlock).toBe(false);
  });

  test('checkOpenThree test', () => {
    const newPosition = new Position(7, 9);
    const positions: PositionTuple<3> = [...initialPositions, newPosition];

    board.dropStone(newPosition, 'black');
    const isOpenThree = OmokAnalyzer.checkOpenThree(board, positions);
    expect(isOpenThree).toBe(true);

    board.dropStone(new Position(7, 10), 'white');
    const isOpenThreeAfterBlock = OmokAnalyzer.checkOpenThree(board, positions);
    expect(isOpenThreeAfterBlock).toBe(false);
  });

  test('checkOpenFour test', () => {
    const newPositions: PositionTuple<2> = [new Position(7, 10), new Position(7, 11)];

    for (let i = 0; i < newPositions.length; i += 1) {
      board.dropStone(newPositions[i], 'black');
    }

    const positions: PositionTuple<4> = [...initialPositions, ...newPositions];
    const isOpenFour = OmokAnalyzer.checkOpenFour(board, positions);
    expect(isOpenFour).toBe(true);
  });

  test('checkFour test', () => {
    const newPositions: PositionTuple<2> = [new Position(7, 10), new Position(7, 11)];

    for (let i = 0; i < newPositions.length; i += 1) {
      board.dropStone(newPositions[i], 'black');
    }

    const positions: PositionTuple<4> = [...initialPositions, ...newPositions];
    const isFour = OmokAnalyzer.checkOpenFour(board, positions);
    expect(isFour).toBe(true);

    const blockPositions = [new Position(7, 6), new Position(7, 12)];

    for (let i = 0; i < blockPositions.length; i += 1) {
      board.dropStone(blockPositions[i], 'white');
    }

    const isFourAfterBlock = OmokAnalyzer.checkOpenFour(board, positions);
    expect(isFourAfterBlock).toBe(false);
  });
});
