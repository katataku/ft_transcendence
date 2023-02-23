import {
  Logger,
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
} from '@nestjs/common';
import { MatchDto } from '../common/dto/match.dto';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private service: MatchService) {}

  @Post()
  createMatch(@Body() match: MatchDto): Promise<void> {
    return this.service.createMatch(match);
  }

  @Get('matches')
  getMatches(): Promise<MatchDto[]> {
    return this.service.getMatches();
  }

  @Get(':id')
  getMatchById(@Param('id') id: number): Promise<MatchDto> {
    return this.service.getMatchById(id);
  }

  /*  @Put(':id')
  addWinner(
    @Param('matchId') matchId: number,
    @Param('userId') userId: number,
  ): string {
    return 'adds winner';
  }

  @Put(':id')
  addPowerup(@Param('matchId') matchId: number): string {
    return 'adds powerup';
  } */
}
