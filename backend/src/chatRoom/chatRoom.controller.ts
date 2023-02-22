import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ChatRoomService } from './chatRoom.service';
import {
  ChatRoomAuthReqDto,
  ChatRoomReqDto,
  ChatRoomResDto,
} from '../common/dto/chatRoom.dto';

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

  @Post('auth')
  async authChatRoom(@Body() data: ChatRoomAuthReqDto): Promise<void> {
    const result = await this.service.authChatRoom(data);
    if (!result)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return;
  }
}
