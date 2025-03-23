import React from 'react';
import ShadowBox from '@/src/app/components/ShadowBox';
import styles from './gameInfoHeader.module.css';

function PlayerInfo({ userCount }: { userCount: number }) {
  return (
    <div className={styles.container}>
      {/* Player 1 */}
      <div className={styles.player}>
        <span className="material-icons">person</span>
        {userCount >= 1 && (
          <span className={styles.text}>
            Player 1 (<b>흑</b>)
          </span>
        )}
      </div>

      {/* Player 2 */}
      <div className={styles.player}>
        {userCount === 2 && (
          <span className={styles.text}>
            Player 2 (<b>백</b>)
          </span>
        )}
        <span className="material-icons">person</span>
      </div>
    </div>
  );
}

function GameInfoHeader({ roomId, userCount }: { roomId: string; userCount: number }) {
  return (
    <header className={styles.header}>
      <ShadowBox>
        <h2>방 정보 : {roomId}</h2>
        <PlayerInfo userCount={userCount} />
      </ShadowBox>
    </header>
  );
}

export default GameInfoHeader;
