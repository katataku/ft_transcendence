import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship, User, PendingFriendship } from '../entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Friendship, PendingFriendship])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
