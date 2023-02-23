import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { MatchDto } from '../common/dto/match.dto';

@Controller('match')
export class MatchController {
  // constructor(private service: PlayersService) {}

  @Post()
  createMatch(@Body() MatchDto: MatchDto): string {
    return `creates player #${MatchDto.id}`;
  }

  @Get()
  getMatches(): string {
    return `gets all matches`;
  }

  @Get(':id')
  getMatchById(@Param('id') id: number): string {
    return `gets Match #${id}`;
  }

  @Put(':id')
  addWinner(
    @Param('matchId') matchId: number,
    @Param('userId') userId: number,
  ): string {
    return 'adds winner';
  }

  @Put(':id')
  addPowerup(@Param('matchId') matchId: number): string {
    return 'adds powerup';
  }
}
