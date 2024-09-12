import { useEffect, useRef, useState } from 'react';

type ContextType = 'bitmaprenderer' | '2d' | 'webgl' | 'webgl2';

function useCanvas(contextType: ContextType = '2d') {
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const ref = useRef<HTMLCanvasElement | null>(null);
  const canvas = ref.current;

  useEffect(() => {
    if (ref.current) {
      setContext(ref.current.getContext('2d'));
    }
  }, [ref, contextType]);

  return { canvas, context, ref };
}

export default useCanvas;
