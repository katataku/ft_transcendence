import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ChatRoomService } from './chatRoom.service';
import { ChatRoomReqDto, ChatRoomResDto } from '../common/dto/chatRoom.dto';

@Controller('chatRoom')
export class ChatRoomController {
  constructor(private service: ChatRoomService) {}

  @Get()
  get(): Promise<ChatRoomResDto[]> {
    return this.service.getList();
  }

  @Post()
  post(@Body() data: ChatRoomReqDto): Promise<ChatRoomResDto> {
    return this.service.createRoom(data);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.deleteRoom(id);
  }
}
