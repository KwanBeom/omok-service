'use client';

import { io } from 'socket.io-client';

const socket = io("https://gomoku.asia", {
	path: "/socket.io",
});

export default socket;
