import { Controller, Get } from '@nestjs/common';
import { ChatMuteUserService } from './chat-mute-user.service';
import { ChatMuteUser } from './chat-mute-user.entity';

@Controller('chat-mute-user')
export class ChatMuteUserController {
  constructor(private service: ChatMuteUserService) {}

  @Get()
  get(): Promise<ChatMuteUser[]> {
    return this.service.getList();
  }
}
