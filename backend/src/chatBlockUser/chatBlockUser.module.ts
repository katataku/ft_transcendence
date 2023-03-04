import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatBlockUserController } from './chatBlockUser.controller';
import { ChatBlockUser } from '../entities/chatBlockUser.entity';
import { ChatBlockUserService } from './chatBlockUser.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatBlockUser])],
  controllers: [ChatBlockUserController],
  providers: [ChatBlockUserService],
})
export class ChatBlockUserModule {}
