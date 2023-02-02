import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthCheck } from './healthCheck.entity';

@Injectable()
export class HealthCheckService {
  constructor(
    @InjectRepository(HealthCheck)
    private healthCheckRepository: Repository<HealthCheck>,
  ) {}

  async create() {
    const data = new HealthCheck();
    data.health = 'OK';
    this.healthCheckRepository.save(data);
  }

  async getLatest(): Promise<HealthCheck> {
    const rows: HealthCheck[] = await this.healthCheckRepository.find();
    if (rows.length != 0) {
      return this.healthCheckRepository.findOne({ where: { id: rows.length } });
    }
    throw new HttpException('Not found.', HttpStatus.NOT_FOUND);
  }

  async deleteLatest() {
    const rows: HealthCheck[] = await this.healthCheckRepository.find();
    if (rows.length != 0) {
      this.healthCheckRepository.delete(rows.length);
      return;
    }
    throw new HttpException('Not found.', HttpStatus.NOT_FOUND);
  }
}
