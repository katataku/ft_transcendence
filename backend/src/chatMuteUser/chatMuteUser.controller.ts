import { Controller, Get } from '@nestjs/common';
import { ChatMuteUserService } from './chatMuteUser.service';
import { ChatMuteUser } from '../entities/chatMuteUser.entity';

@Controller('chat-mute-user')
export class ChatMuteUserController {
  constructor(private service: ChatMuteUserService) {}

  @Get()
  get(): Promise<ChatMuteUser[]> {
    return this.service.getList();
  }
}
