import { Server } from 'socket.io';
import Redis from 'ioredis';

const pub = new Redis({
  host: 'redis-23a4a17e-techbrains21-0f28.a.aivencloud.com',
  port: 25486,
  username: 'default',
  password: 'AVNS_pJwIge1b5AoJ52IUnnm',
});
const sub = new Redis({
  host: 'redis-23a4a17e-techbrains21-0f28.a.aivencloud.com',
  port: 25486,
  username: 'default',
  password: 'AVNS_pJwIge1b5AoJ52IUnnm',
});

class SocketService {
  private _io: Server;

  constructor() {
    this._io = new Server({
      cors: {
        allowedHeaders: ['*'],
        origin: '*',
      },
    });
    sub.subscribe('MESSAGES');
    // console.log('Initializing Socker Server....');
  }

  public initListeners() {
    const io = this.io;
    console.log('Initialzed Socket Listeneres ....');
    io.on('connect', async (socket) => {
      console.log(`New Socket Connected`, socket.id);
      socket.on('event:message', async ({ message }: { message: string }) => {
        console.log('New Message Recieved', message);

        // Publish this message to redis
        await pub.publish('MESSAGES', JSON.stringify({ message }));
      });
    });

    sub.on('message', (channel, message) => {
      if (channel === 'MESSAGES') {
        console.log('new message from redis', message);
        io.emit('message', message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
