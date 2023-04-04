import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchDto, MatchResultDto } from '../common/dto/match.dto';
import { Match } from '../entities/match.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) {}

  async createMatch(match: MatchDto): Promise<MatchDto> {
    return await this.matchRepository.save(match);
  }

  async getMatches(): Promise<MatchDto[]> {
    return await this.matchRepository.find();
  }

  async getMatchById(id: number): Promise<MatchDto> {
    return await this.matchRepository.findOne({
      where: { id: id },
    });
  }

  async postMatchResult(result: MatchResultDto): Promise<void> {
    const match: MatchDto = await this.getMatchById(result.id);
    if (!match) throw new NotFoundException();
    match.winner = result.winner;
    await this.matchRepository.save(match);
  }
}
