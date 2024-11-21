import React, { createContext, useContext, useRef, useEffect, ReactNode, useMemo } from 'react';

interface CanvasContextProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  context: CanvasRenderingContext2D | null;
}

const CanvasContext = createContext<CanvasContextProps | null>(null);

interface CanvasProviderProps {
  children: ReactNode;
}

export function CanvasProvider({ children }: CanvasProviderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = React.useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      setContext(canvasRef.current.getContext('2d'));
    }
  }, []);

  const value = useMemo(() => ({ canvasRef, context }), [canvasRef, context]);

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
  width: number;
  height: number;
  style?: React.CSSProperties;
  className?: string;
}

export function Canvas({ width, height, style, className }: CanvasProps) {
  const { canvasRef } = useCanvasContext();

  return (
    <canvas ref={canvasRef} width={width} height={height} style={style} className={className} />
  );
}
