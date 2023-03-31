import { Controller, Get, Param } from '@nestjs/common';
import { MatchDto } from '../common/dto/match.dto';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private service: MatchService) {}

  @Get('matches')
  getMatches(): Promise<MatchDto[]> {
    return this.service.getMatches();
  }

  @Get(':id')
  getMatchById(@Param('id') id: number): Promise<MatchDto> {
    return this.service.getMatchById(id);
  }
}
