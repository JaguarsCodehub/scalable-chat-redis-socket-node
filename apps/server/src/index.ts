import http from 'http';
import SocketService from './services/socket';
import { startMesssageConsumer } from './services/kafka';

async function init() {
  startMesssageConsumer();
  const socketService = new SocketService();

  const httpServer = http.createServer();
  const PORT = process.env.PORT ? process.env.PORT : 8000;

  socketService.io.attach(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`HTTP SERVER started at PORT:${PORT}`);
  });

  socketService.initListeners();
}

init();
