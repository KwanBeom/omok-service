import { EffectCallback, useEffect, useState } from 'react';

const useEffectOnce = (effect: EffectCallback, dependency: unknown[]) => {
  const [hasRun, setHasRun] = useState(false);
  useEffect(() => {
    if (!hasRun) {
      setHasRun(true);
      effect();
    }
  }, [hasRun, ...dependency]);
};

export default useEffectOnce;
