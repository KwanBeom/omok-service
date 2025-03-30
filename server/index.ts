import next from 'next';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import setupSocketHandlers from './socket';

const dev = process.env.NODE_ENV !== 'production';
const hostname = dev ? 'localhost' : '0.0.0.0';
const port = 3000;
// when using :middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    pingInterval: 10000, // 25초마다 핑 요청
    pingTimeout: 5000, // 5초 동안 응답 없으면 연결 종료
  });
  setupSocketHandlers(io);
  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
