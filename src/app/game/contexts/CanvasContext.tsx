import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  ReactNode,
  useMemo,
  useState,
} from 'react';
import { CONFIG } from '../components/BoardUI/constants';

interface CanvasContextProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  context: CanvasRenderingContext2D | null;
  canvasSize: number;
  boardPadding: number;
}

const CanvasContext = createContext<CanvasContextProps | null>(null);

interface CanvasProviderProps {
  canvasSize: number;
  children: ReactNode;
}

export function CanvasProvider({ canvasSize, children }: CanvasProviderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [boardPadding, setBoardPadding] = useState(0);

  useEffect(() => {
    if (canvasRef.current) {
      setContext(canvasRef.current.getContext('2d'));
    }
    if (canvasSize) {
      setBoardPadding(canvasSize / CONFIG.RATIO / 8);
    }
  }, [canvasSize]);

  const value = useMemo(
    () => ({ canvasSize, boardPadding, canvasRef, context }),
    [canvasSize, boardPadding, canvasRef, context],
  );

  return <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>;
}

export function useCanvasContext() {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
}

interface CanvasProps {
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
}

export function Canvas({ width, height, style, className }: CanvasProps) {
  const { canvasRef } = useCanvasContext();

  return (
    <canvas ref={canvasRef} width={width} height={height} style={style} className={className} />
  );
}
