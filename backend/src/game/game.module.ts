import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { MatchService } from 'src/match/match.service';
import { GameGateway } from './game.gateway';
import {
  Friendship,
  UserMatchHistory,
  PendingFriendship,
  User,
  UserAvatars,
} from '../entities/users.entity';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Friendship,
      PendingFriendship,
      UserAvatars,
      Match,
      UserMatchHistory,
    ]),
  ],
  providers: [GameGateway, MatchService, UsersService],
})
export class GameModule {}
