'use client';

import { io } from 'socket.io-client';

const socket = io({
  reconnection: true, // 자동 재연결 활성화
  reconnectionAttempts: 5, // 최대 5번 시도
  reconnectionDelay: 1000, // 1초마다 재시도
});

export default socket;
