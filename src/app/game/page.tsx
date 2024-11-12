'use client';

import { useEffect, useRef, useState } from 'react';
import Omok from '../_omok/core/Omok';
import { Position } from './types/Position';
import { PlayerColor } from './types/Stone';
import BoardUI from './components/BoardUI';
import ConfirmButton from './components/ConfirmButton';
import { CanvasProvider } from './components/BoardUI/context/CanvasContext';
import { Geumsu } from './components/BoardUI/GeumsuOverlay';
import { Stone } from './components/BoardUI/Stones';

export default function Page() {
  const { current: omok } = useRef(new Omok());
  const gameOver = omok.checkWin();
  const [turn, setTurn] = useState<PlayerColor>('black');
  const [move, setMove] = useState<Position[]>([]);

  const changeTurn = () => setTurn(turn === 'black' ? 'white' : 'black');

  const playOmok = (position: Position) => {
    const { x, y } = position;

    setStones((prev) => {
      const newStones = [...prev, { position, color: turn }];
      return newStones;
    });

    omok.play(x, y);
    changeTurn();
    setMove((prev) => [...prev, position]);
  };

  const undo = () => {
    omok.undo();
    changeTurn();
    setMove((prev) => prev.slice(0, -1));
  };

  const [stones, setStones] = useState<Stone[]>([]);
  const [geumsu, setGeumsu] = useState<Geumsu[]>([]);
  const [position, setPosition] = useState<Position | undefined>();

  console.log(position);
  return (
    <CanvasProvider>
      <BoardUI
        stones={stones}
        geumsu={geumsu}
        onClick={(selectedPosition) => {
          setPosition(selectedPosition);
        }}
      />
      <ConfirmButton
        onClick={() => {
          if (position) playOmok(position);
        }}
      />
    </CanvasProvider>
  );
}
