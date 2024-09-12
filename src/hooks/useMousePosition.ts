import { throttle } from 'lodash';
import { MutableRefObject, useEffect, useState } from 'react';

/** 마우스 위치를 계산하는 커스텀 훅 */
function useMousePosition<T extends HTMLElement>(
  ref: MutableRefObject<T | null>,
  options?: { throttleDelay?: number },
) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const targetElement = ref.current;

    if (!targetElement) return undefined;

    const handleMouseMove = throttle((e: MouseEvent) => {
      const rect = targetElement.getBoundingClientRect();

      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }, options?.throttleDelay);

    targetElement.addEventListener('mousemove', handleMouseMove);

    return () => {
      targetElement.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ref]);

  return position;
}

export default useMousePosition;
