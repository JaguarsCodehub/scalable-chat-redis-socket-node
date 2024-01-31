import { Server } from 'socket.io';
import Redis from 'ioredis';
import { produceMessage } from './kafka';

const pub = new Redis({
  host: 'redis-34d4334-jyotindrakt21-e509.a.aivencloud.com',
  port: 10488,
  username: 'default',
  password: 'AVNS_iRkBVt3975YgEowOrJN',
});
const sub = new Redis({
  host: 'redis-34d4334-jyotindrakt21-e509.a.aivencloud.com',
  port: 10488,
  username: 'default',
  password: 'AVNS_iRkBVt3975YgEowOrJN',
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

    sub.on('message', async (channel, message) => {
      if (channel === 'MESSAGES') {
        console.log('new message from redis', message);
        io.emit('message', message);
        await produceMessage(message);
        console.log('Message Produced to Kafka Broker');
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
