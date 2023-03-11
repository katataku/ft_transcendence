import { Module } from '@nestjs/common';
import { MatchService } from 'src/match/match.service';
import { GameGateway } from './game.gateway';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users';
import { MatchModule } from '../match';

@Module({
  imports: [UsersModule, MatchModule],
  providers: [GameGateway, MatchService, UsersService],
})
export class GameModule {}
