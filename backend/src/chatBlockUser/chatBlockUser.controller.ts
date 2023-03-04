import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ChatBlockUserService } from './chatBlockUser.service';
import {
  ChatBlockUserDto,
  ChatBlockUserPKDto,
} from 'src/common/dto/chatBlockUser.dto';

@Controller('chat-block-user')
export class ChatBlockUserController {
  constructor(private service: ChatBlockUserService) {}

  @Get()
  get(): Promise<ChatBlockUserDto[]> {
    return this.service.getList();
  }

  @Get(':blockUser')
  getOne(@Param('blockUser') blockUser: number): Promise<ChatBlockUserDto[]> {
    return this.service.getListOne(blockUser);
  }

  @Post()
  post(@Body() data: ChatBlockUserDto): Promise<ChatBlockUserDto> {
    return this.service.updateBlock(data);
  }

  @Delete()
  delete(@Body() data: ChatBlockUserPKDto): Promise<void> {
    return this.service.delete(data);
  }
}
