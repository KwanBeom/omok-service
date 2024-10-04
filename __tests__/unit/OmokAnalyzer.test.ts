import Board from '@/app/_omok/Board';
import OmokAnalyzer from '@/app/_omok/OmokAnalyzer';
import { STONE } from '@/app/_omok/Stone';
import { createDirection, createPosition, Positions } from '@/app/_omok/utils';

describe('OmokAnalyzer tests', () => {
  let board: Board;
  const positions: Positions<2> = [createPosition(7, 7), createPosition(7, 8)];

  beforeEach(() => {
    board = new Board();

    for (let i = 0; i < positions.length; i += 1) {
      board.dropStone(positions[i], STONE.BLACK.POINT);
    }
  });

  test('getDistance test', () => {
    const distance = OmokAnalyzer.getDistance(positions[0], positions[1]);

    expect(distance).toBe(1);
  });

  test('isSequential test', () => {
    const isSequential = OmokAnalyzer.isSequential(positions);

    expect(isSequential).toBe(true);
  });

  test('getDirection test', () => {
    const direction = OmokAnalyzer.getDirection(positions[0], positions[1]);

    expect(direction).toEqual(createDirection(0, 1));
  });

  test('checkOpenTwo test', () => {
    const isOpenTwo = OmokAnalyzer.checkOpenTwo(board, positions);

    expect(isOpenTwo).toBe(true);

    board.dropStone(createPosition(7, 9), STONE.WHITE.POINT);

    const isOpenTwoAfterBlock = OmokAnalyzer.checkOpenTwo(board, positions);

    expect(isOpenTwoAfterBlock).toBe(false);
  });

  test('checkOpenThree test', () => {
    const newPosition = createPosition(7, 9);
    const three: Positions<3> = [...positions, newPosition];

    board.dropStone(newPosition, STONE.BLACK.POINT);

    const isOpenThree = OmokAnalyzer.checkOpenThree(board, three);

    expect(isOpenThree).toBe(true);

    board.dropStone(createPosition(7, 10), STONE.WHITE.POINT);

    const isOpenThreeAfterBlock = OmokAnalyzer.checkOpenThree(board, three);

    expect(isOpenThreeAfterBlock).toBe(false);
  });

  test('checkOpenFour test', () => {
    const newPositions: Positions<2> = [createPosition(7, 10), createPosition(7, 11)];

    for (let i = 0; i < newPositions.length; i += 1) {
      board.dropStone(newPositions[i], STONE.BLACK.POINT);
    }

    const isOpenFour = OmokAnalyzer.checkOpenFour(board, [...positions, ...newPositions]);

    expect(isOpenFour).toBe(true);
  });

  test('checkFour test', () => {
    const newPositions: Positions<2> = [createPosition(7, 10), createPosition(7, 11)];

    for (let i = 0; i < newPositions.length; i += 1) {
      board.dropStone(newPositions[i], STONE.BLACK.POINT);
    }

    const four: Positions<4> = [...positions, ...newPositions];
    const isFour = OmokAnalyzer.checkOpenFour(board, four);

    expect(isFour).toBe(true);

    const blockPositions = [createPosition(7, 6), createPosition(7, 12)];

    for (let i = 0; i < blockPositions.length; i += 1) {
      board.dropStone(blockPositions[i], STONE.WHITE.POINT);
    }

    const isFourAfterBlock = OmokAnalyzer.checkOpenFour(board, four);

    expect(isFourAfterBlock).toBe(false);
  });
});
