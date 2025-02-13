import { ROOM_MODE } from './types/room';

const ROUTES = {
  GAME: (mode: ROOM_MODE, roomId: string) => `/game?id=${roomId}&mode=${mode}`,
};

export default ROUTES;
