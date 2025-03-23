import React, { useEffect, useState } from 'react';
import styles from './ProgressBar.module.css';

export default function ProgressBar({ time, turn }: { time: number; turn: number }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setProgress(100);

    const startTime = Date.now();
    const interval = 100;
    const totalTime = time * 1000;

    const timer = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.max(100 - (elapsedTime / totalTime) * 100, 0);

      setProgress(newProgress);

      if (newProgress <= 0) {
        clearInterval(timer);
      }
    }, interval);

    setProgress(100);

    return () => clearInterval(timer);
  }, [turn]);

  return (
    <div className={styles['progress-container']}>
      <div
        className={styles['progress-bar']}
        style={{
          width: `${progress}%`,
          transition: 'width 0.01s linear',
        }}
      />
      <span className={styles['progress-text']}>{time}</span>
    </div>
  );
}
