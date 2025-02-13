import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { Sequence } from '@/src/hooks/useSequence';
import { PLAYER } from '../types/Stone';
import { Geumsu } from '../types/Geumsu';

// 전역에서 사용되는 오목 진행 관련 컨텍스트 파일
type OmokContextProps = {
  user: PLAYER;
  turn: PLAYER;
  sequence: Sequence[];
  geumsu: Geumsu[];
};

const OmokContext = createContext<OmokContextProps | null>(null);

type OmokProviderProps = OmokContextProps & { children: ReactNode };

export function OmokProvider({ turn, user, geumsu, sequence, children }: OmokProviderProps) {
  const value = useMemo(() => ({ user, geumsu, turn, sequence }), [user, turn, geumsu, sequence]);

  return <OmokContext.Provider value={value}>{children}</OmokContext.Provider>;
}

export function useOmokContext() {
  const context = useContext(OmokContext);
  if (!context) {
    throw new Error('useOmok must be used within a OmokProvider');
  }
  return context;
}
