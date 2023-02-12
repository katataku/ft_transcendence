import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ChatMuteUserService } from './chatMuteUser.service';
import { ChatMuteUser } from '../entities/chatMuteUser.entity';

@Controller('chat-mute-user')
export class ChatMuteUserController {
  constructor(private service: ChatMuteUserService) {}

  @Get()
  get(): Promise<ChatMuteUser[]> {
    return this.service.getList();
  }

  @Get(':muteUser')
  getOne(@Param('muteUser') muteUser: string): Promise<ChatMuteUser[]> {
    return this.service.getListOne(muteUser);
  }

  @Post()
  post(@Body() data): Promise<ChatMuteUser> {
    return this.service.updateMute(data);
  }

  @Delete()
  delete(@Body() data): Promise<void> {
    return this.service.delete(data);
  }
}
