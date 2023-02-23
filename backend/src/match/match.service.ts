import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchDto } from '../common/dto/match.dto';
import { Match } from '../entities/match.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) {}

  async createMatch(match: MatchDto): Promise<void> {
    await this.matchRepository.save(match);
  }

  async getMatches(): Promise<MatchDto[]> {
    const res: MatchDto[] = await this.matchRepository.find();
    return res;
  }

  async getMatchById(id: number): Promise<MatchDto> {
    const res: MatchDto = await this.matchRepository.findOne({
      where: { id: id },
    });
    return res;
  }
}
