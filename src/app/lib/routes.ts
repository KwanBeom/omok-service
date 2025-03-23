import { RoomMode } from './types/room';

const ROUTES = {
  GAME: (mode: RoomMode, roomId: string) => `/game?id=${roomId}&mode=${mode}`,
};

export default ROUTES;
