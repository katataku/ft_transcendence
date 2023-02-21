import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomMembers } from 'src/entities/chatRoomMembers.entity';
import { ChatRoomMembersController } from './chatRoomMembers.controller';
import { ChatRoomMembersService } from './chatRoomMembers.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoomMembers])],
  controllers: [ChatRoomMembersController],
  providers: [ChatRoomMembersService],
})
export class ChatRoomMembersModule {}
