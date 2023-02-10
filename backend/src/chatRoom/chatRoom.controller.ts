import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ChatRoom } from 'src/entities/chatRoom.entity';
import { ChatRoomService } from './chatRoom.service';

@Controller('chatRoom')
export class ChatRoomController {
  constructor(private service: ChatRoomService) {}

  @Get()
  get(): Promise<ChatRoom[]> {
    return this.service.getList();
  }

  @Post()
  post(@Body() data): Promise<void> {
    return this.service.createRoom(data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.deleteRoom(id);
  }
}
