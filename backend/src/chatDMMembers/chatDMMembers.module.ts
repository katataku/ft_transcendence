import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatDMMembers } from 'src/entities/chatDMMembers.entity';
import { ChatRoom } from 'src/entities/chatRoom.entity';
import { ChatDMMembersController } from './chatDMMembers.controller';
import { ChatDMMembersService } from './chatDMMembers.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatDMMembers, ChatRoom])],
  controllers: [ChatDMMembersController],
  providers: [ChatDMMembersService],
})
export class ChatDMMembersModule {}
