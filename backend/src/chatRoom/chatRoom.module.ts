import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from 'src/entities/chatRoom.entity';
import { User } from 'src/entities/users.entity';
import { ChatRoomController } from './chatRoom.controller';
import { ChatRoomService } from './chatRoom.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, User])],
  controllers: [ChatRoomController],
  providers: [ChatRoomService],
})
export class ChatRoomModule {}
