import { useEffect, useState } from 'react';

/** 타이머 커스텀 훅, Toggle 함수로 일시정지, 재생 */
const useTimer = (sec: number, timeover?: () => void) => {
  const [time, setTime] = useState(sec);
  const [isPause, setIsPause] = useState(true);

  useEffect(() => {
    if (time === 0 && timeover) {
      setIsPause(true);
      setTimeout(timeover, 1000);
    }

    let timerId: NodeJS.Timeout;

    if (!isPause) {
      timerId = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);

      if (time === 0) clearInterval(timerId);
    }

    return () => clearInterval(timerId);
  }, [timeover, time, isPause]);

  const toggle = () => setIsPause((prev) => !prev);

  const reset = () => {
    setIsPause(true);
    setTime(sec);
  };

  return { time, toggle, reset, isPause };
};

export default useTimer;
