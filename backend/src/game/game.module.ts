import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { MatchService } from 'src/match/match.service';
import { GameGateway } from './game.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Match])],
  providers: [GameGateway, MatchService],
})
export class GameModule {}
