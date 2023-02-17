import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ChatMuteUserService } from './chatMuteUser.service';
import {
  ChatMuteUserDto,
  ChatMuteUserPKDto,
} from 'src/common/dto/chatMuteUser.dto';

@Controller('chat-mute-user')
export class ChatMuteUserController {
  constructor(private service: ChatMuteUserService) {}

  @Get()
  get(): Promise<ChatMuteUserDto[]> {
    return this.service.getList();
  }

  @Get(':muteUser')
  getOne(@Param('muteUser') muteUser: number): Promise<ChatMuteUserDto[]> {
    return this.service.getListOne(muteUser);
  }

  @Post()
  post(@Body() data: ChatMuteUserDto): Promise<ChatMuteUserDto> {
    return this.service.updateMute(data);
  }

  @Delete()
  delete(@Body() data: ChatMuteUserPKDto): Promise<void> {
    return this.service.delete(data);
  }
}
