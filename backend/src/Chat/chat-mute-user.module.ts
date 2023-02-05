import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMuteUserController } from './chat-mute-user.controller';
import { ChatMuteUser } from './chat-mute-user.entity';
import { ChatMuteUserService } from './chat-mute-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMuteUser])],
  controllers: [ChatMuteUserController],
  providers: [ChatMuteUserService],
})
export class ChatMuteUserModule {}
