import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMuteUserController } from './chatMuteUser.controller';
import { ChatMuteUser } from '../entities/chatMuteUser.entity';
import { ChatMuteUserService } from './chatMuteUser.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMuteUser])],
  controllers: [ChatMuteUserController],
  providers: [ChatMuteUserService],
})
export class ChatMuteUserModule {}
