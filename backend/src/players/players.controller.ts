import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { CreatePlayerDto } from '../common/dto/player.dto';

@Controller('player')
export class PlayersController {
  // constructor(private service: PlayersService) {}

  @Post()
  createPlayer(@Body() createPlayerDto: CreatePlayerDto): string {
    return `creates player #${createPlayerDto.id}`;
  }

  @Get(':id')
  getPlayerById(@Param('id') id: number): string {
    return `gets player #${id}`;
  }

  @Put(':id')
  addMatch(@Param('id') id: number): string {
    return `increments matches of player #${id}`;
  }

  @Put(':id')
  addWin(@Param('id') id: number): string {
    return `increments wins & streak of player #${id}`;
  }

  @Put(':id')
  addLoss(@Param('id') id: number): string {
    return `increments loss & reset streak of player #${id}`;
  }

  @Put(':id')
  addPowerup(@Param('id') id: number): string {
    return `increments powerups of player #${id}`;
  }
}
