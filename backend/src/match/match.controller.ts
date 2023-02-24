import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { MatchDto, MatchResultDto } from '../common/dto/match.dto';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private service: MatchService) {}

  @Post()
  createMatch(@Body() match: MatchDto): Promise<MatchDto> {
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

  @Post('result/:id')
  postMatchResult(@Body() result: MatchResultDto): Promise<void> {
    return this.service.postMatchResult(result);
  }
}
