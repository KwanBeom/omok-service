import OmokAnalyzer from '@/app/_omok/core/OmokAnalyzer';
import Position, { IPositionTuple, PositionTuple } from '@/app/_omok/entities/Position';
import Board from '@/app/_omok/core/Board';

describe('OmokAnalyzer tests', () => {
  let board: Board;
  let omokAnalyzer: OmokAnalyzer;

  const initialPositions: IPositionTuple<2> = [new Position(7, 7), new Position(7, 8)];

  beforeEach(() => {
    board = new Board();
    omokAnalyzer = new OmokAnalyzer(board);

    for (let i = 0; i < initialPositions.length; i += 1) {
      board.dropStone(initialPositions[i], 'black');
    }

    omokAnalyzer.update(board);
  });

  test('checkOpenTwo test', () => {
    const positions: IPositionTuple<2> = [...initialPositions];
    const isOpenTwo = omokAnalyzer.checkOpenTwo(positions);

    expect(isOpenTwo).toBe(true);

    board.dropStone(new Position(7, 9), 'white');
    const isOpenTwoAfterBlock = omokAnalyzer.checkOpenTwo(positions);

    expect(isOpenTwoAfterBlock).toBe(false);
  });

  test('checkOpenThree test', () => {
    const newPosition = new Position(7, 9);

    const positions: IPositionTuple<3> = [...initialPositions, newPosition];

    board.dropStone(newPosition, 'black');
    const isOpenThree = omokAnalyzer.checkOpenThree(positions);
    expect(isOpenThree).toBe(true);

    board.dropStone(new Position(7, 10), 'white');
    const isOpenThreeAfterBlock = omokAnalyzer.checkOpenThree(positions);
    expect(isOpenThreeAfterBlock).toBe(false);
  });

  test('checkOpenFour test', () => {
    const newPositions: PositionTuple<2> = [new Position(7, 10), new Position(7, 11)];

    for (let i = 0; i < newPositions.length; i += 1) {
      board.dropStone(newPositions[i], 'black');
    }

    const positions: IPositionTuple<4> = [...initialPositions, ...newPositions];
    const isOpenFour = omokAnalyzer.checkOpenFour(positions);

    expect(isOpenFour).toBe(true);
  });

  test('checkFour test', () => {
    const newPositions: PositionTuple<2> = [new Position(7, 10), new Position(7, 11)];

    for (let i = 0; i < newPositions.length; i += 1) {
      board.dropStone(newPositions[i], 'black');
    }

    const positions: IPositionTuple<4> = [...initialPositions, ...newPositions];

    const isFour = omokAnalyzer.checkOpenFour(positions);
    expect(isFour).toBe(true);

    const blockPositions = [new Position(7, 6), new Position(7, 12)];

    for (let i = 0; i < blockPositions.length; i += 1) {
      board.dropStone(blockPositions[i], 'white');
    }

    const isFourAfterBlock = omokAnalyzer.checkOpenFour(positions);
    expect(isFourAfterBlock).toBe(false);
  });
});
