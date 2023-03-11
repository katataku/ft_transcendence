import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Friendship,
  User,
  PendingFriendship,
  UserAvatars,
  UserMatchHistory,
} from '../entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Friendship,
      PendingFriendship,
      UserAvatars,
      UserMatchHistory,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
