import Board from './Board';
import Stone from './Stone';

export type StoneBoard = ReturnType<Board<Stone>['get']>;

export type Position = [number, number];
