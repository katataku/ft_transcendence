import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { MatchService } from 'src/match/match.service';
import { GameGateway } from './game.gateway';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Match])],
  providers: [GameGateway, MatchService, UsersService],
})
export class GameModule {}
