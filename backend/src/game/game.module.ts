import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { UsersModule } from '../users';
import { MatchModule } from '../match';

@Module({
  imports: [UsersModule, MatchModule],
  providers: [GameGateway],
})
export class GameModule {}
