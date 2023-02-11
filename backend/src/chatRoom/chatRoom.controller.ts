import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ChatRoomService } from './chatRoom.service';
import { ChatRoomDto } from './dto/chatRoom.dto';

@Controller('chatRoom')
export class ChatRoomController {
  constructor(private service: ChatRoomService) {}

  @Get()
  get(): Promise<ChatRoomDto[]> {
    return this.service.getList();
  }

  @Post()
  post(@Body() data): Promise<ChatRoomDto> {
    return this.service.createRoom(data);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.deleteRoom(id);
  }
}
