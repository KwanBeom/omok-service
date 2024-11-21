import { useEffect, useRef, useState } from 'react';

const useCanvas2D = () => {
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      setContext(canvasRef.current.getContext('2d'));
    }
  }, []);

  return { context, canvasRef };
};

export default useCanvas2D;
