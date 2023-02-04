import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(3002, { cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  clientList: Map<string, Socket[]> = new Map();

  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() _client: Socket,
  ): string {
    this.logger.log(`message`);
    this.server.emit('message', data);
    return data;
  }

  @SubscribeMessage('channelNotification')
  handleChannelNotification(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    const room: string = data;
    this.logger.log(`channelNotification`);
    this.logger.log('room notify:' + room);
    this.logger.log('clientList.get(room):' + this.clientList.get(room));
    if (this.clientList.get(room) === undefined) {
      this.clientList[room] = [];
    }
    this.clientList[room].push(client);
    this.logger.log('clientList.get(room):' + this.clientList.get(room));
    return data;
  }

  afterInit(_server: Server) {
    //初期化
    this.logger.log('初期化しました。');
  }

  handleConnection(client: Socket, ..._args: any[]) {
    //クライアント接続時
    this.logger.log(`Client connected: ${client.id}`);
    return { event: 'message', data: 'hello' };
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    //クライアント切断時
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
