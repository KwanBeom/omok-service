'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateRoom, JoinRoom } from './lib/types/room';
import { ROOM_ID, ROOM_MODE } from './lib/constants/room';
import ROUTES from './lib/routes';
import styles from './page.module.css';
import Modal from './components/modal';

export default function Home() {
  // 입장 모드 [1]: 생성, [2]: 입장
  const [roomMode, setRoomMode] = useState<CreateRoom | JoinRoom>(ROOM_MODE.CREATE);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const toggleModal = () => setModalOpen(!modalOpen);

  const handleCreateButtonClick = () => {
    setRoomMode(ROOM_MODE.CREATE);
    toggleModal();
  };

  const handleJoinButtonClick = () => {
    setRoomMode(ROOM_MODE.JOIN);
    toggleModal();
  };

  const handleSubmit = (value: string) => {
    if (value.length < ROOM_ID.MIN_LENGTH || value.length > ROOM_ID.MAX_LENGTH) {
      alert(`${ROOM_ID.MIN_LENGTH}자 이상 ${ROOM_ID.MAX_LENGTH}자 이하로 입력해주세요.`);
      return;
    }

    router.push(ROUTES.GAME(roomMode, value));
  };

  return (
    <>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.dots}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
          <h2 className={styles['title-kor']}>오목</h2>
          <h2 className={styles['title-eng']}>GOMOKU</h2>
        </header>
        <main className={styles.main}>
          <button
            type="button"
            className={styles['button-create-room']}
            onClick={handleCreateButtonClick}
          >
            <svg width="35" height="35" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
              {/* <!-- 파란색 원 --> */}
              <circle cx="35" cy="35" r="30" fill="#5E96E8" />
              {/* <!-- 플러스(+) --> */}
              <rect x="20" y="32" width="30" height="6" fill="white" />
              <rect x="32" y="20" width="6" height="30" fill="white" />
            </svg>
            <span className="button-text">방 만들기</span>
          </button>
          <button
            type="button"
            className={styles['button-join-room']}
            onClick={handleJoinButtonClick}
          >
            <svg width="35" height="35" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
              {/* <!-- 초록색 원 --> */}
              <circle cx="35" cy="35" r="30" fill="#93dfaa" />
              {/* <!-- 화살표 --> */}
              <rect x="18" y="32" width="22" height="6" fill="white" />
              <polygon points="35,20 50,35 35,50" fill="white" />
            </svg>
            <span className="button-text">방 입장하기</span>
          </button>
        </main>
      </div>
      <Modal
        title={roomMode === ROOM_MODE.JOIN ? '방 입장' : '방 생성'}
        content={`${ROOM_ID.MIN_LENGTH}자 이상 ${ROOM_ID.MAX_LENGTH}자 이하로 입력해주세요.`}
        placeholder="방 아이디를 입력해주세요."
        isOpen={modalOpen}
        toggleOpen={toggleModal}
        onSubmit={handleSubmit}
        onCancel={toggleModal}
      />
    </>
  );
}
