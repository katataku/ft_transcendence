import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { messageEventDto } from '../common/dto/chat.dto';

@WebSocketGateway(3002, { namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: messageEventDto,
    @ConnectedSocket() _client: Socket,
  ): void {
    this.logger.log(`message`);
    this.server.to(data.room).emit('message', data);
  }

  @SubscribeMessage('channelNotification')
  handleChannelNotification(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    const room: string = data;
    this.logger.log(`channelNotification`);
    this.logger.log('room notify:' + room);
    client.join(room);
    return data;
  }

  @SubscribeMessage('kickNotification')
  handleKickNotification(
    @MessageBody() data: string,
    @ConnectedSocket() _client: Socket,
  ): void {
    this.logger.log(`kickNotification`);
    this.server.emit('kickNotification', data);
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
