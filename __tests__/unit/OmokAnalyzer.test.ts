import Direction from '@/app/_omok/entities/Direction';
import OmokAnalyzer from '@/app/_omok/core/OmokAnalyzer';
import Position, { Positions } from '@/app/_omok/entities/Position';
import Board from '@/app/_omok/core/Board';

describe('OmokAnalyzer tests', () => {
  let board: Board;
  const positions: Positions<2> = [new Position(7, 7), new Position(7, 8)];

  beforeEach(() => {
    board = new Board();

    for (let i = 0; i < positions.length; i += 1) {
      board.dropStone(positions[i], 'black');
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

    expect(direction).toEqual(new Direction(0, 1));
  });

  test('checkOpenTwo test', () => {
    const isOpenTwo = OmokAnalyzer.checkOpenTwo(board, positions);

    expect(isOpenTwo).toBe(true);

    board.dropStone(new Position(7, 9), 'white');

    const isOpenTwoAfterBlock = OmokAnalyzer.checkOpenTwo(board, positions);

    expect(isOpenTwoAfterBlock).toBe(false);
  });

  test('checkOpenThree test', () => {
    const newPosition = new Position(7, 9);
    const three: Positions<3> = [...positions, newPosition];

    board.dropStone(newPosition, 'black');

    const isOpenThree = OmokAnalyzer.checkOpenThree(board, three);

    expect(isOpenThree).toBe(true);

    board.dropStone(new Position(7, 10), 'white');

    const isOpenThreeAfterBlock = OmokAnalyzer.checkOpenThree(board, three);

    expect(isOpenThreeAfterBlock).toBe(false);
  });

  test('checkOpenFour test', () => {
    const newPositions: Positions<2> = [new Position(7, 10), new Position(7, 11)];

    for (let i = 0; i < newPositions.length; i += 1) {
      board.dropStone(newPositions[i], 'black');
    }

    const isOpenFour = OmokAnalyzer.checkOpenFour(board, [...positions, ...newPositions]);

    expect(isOpenFour).toBe(true);
  });

  test('checkFour test', () => {
    const newPositions: Positions<2> = [new Position(7, 10), new Position(7, 11)];

    for (let i = 0; i < newPositions.length; i += 1) {
      board.dropStone(newPositions[i], 'black');
    }

    const four: Positions<4> = [...positions, ...newPositions];
    const isFour = OmokAnalyzer.checkOpenFour(board, four);

    expect(isFour).toBe(true);

    const blockPositions = [new Position(7, 6), new Position(7, 12)];

    for (let i = 0; i < blockPositions.length; i += 1) {
      board.dropStone(blockPositions[i], 'white');
    }

    const isFourAfterBlock = OmokAnalyzer.checkOpenFour(board, four);

    expect(isFourAfterBlock).toBe(false);
  });
});
