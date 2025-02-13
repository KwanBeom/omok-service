'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import socket from '../socket';
// import { EVENT_KEYS } from '@/server/constants/events';
// import { createRoom } from './game/sockets/roomSocket';
import Modal from './components/modal';
import { CRETAE_ROOM, JOIN_ROOM } from './lib/types/room';
import { ROOM_ID, ROOM_MODE } from './lib/constants/room';
import ROUTES from './lib/routes';

export default function Home() {
  // 입장 모드 [1]: 생성, [2]: 입장
  const [roomMode, setRoomMode] = useState<CRETAE_ROOM | JOIN_ROOM>(ROOM_MODE.CREATE);
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
      <button type="button" onClick={handleCreateButtonClick}>
        방 만들기
      </button>
      <button type="button" onClick={handleJoinButtonClick}>
        방 입장하기
      </button>
      <Modal
        title={roomMode === ROOM_MODE.JOIN ? '방 입장' : '방 생성'}
        content={`${ROOM_ID.MIN_LENGTH}자 이상 ${ROOM_ID.MAX_LENGTH}자 이하로 입력해주세요.`}
        placeholder="방 아이디를 입력해주세요."
        isOpen={modalOpen}
        onSubmit={handleSubmit}
        onCancel={toggleModal}
      />
    </>
  );
}
