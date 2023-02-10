import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthCheck } from '../entities/healthCheck.entity';
import { HealthDto } from 'src/common/dto/health.dto';

const healthContent = 'OK';

@Injectable()
export class HealthCheckService {
  constructor(
    @InjectRepository(HealthCheck)
    private healthCheckRepository: Repository<HealthCheck>,
  ) {
    this.healthCheckRepository
      .save({ health: healthContent })
      .then((res) => {
        Logger.debug('Health Check Seeded');
      })
      .catch((err) => {
        Logger.error('Faild to Seed');
      });
  }

  async get(): Promise<HealthDto> {
    const data: HealthCheck = await this.healthCheckRepository.findOne({
      where: { health: healthContent },
    });
    if (data == null) {
      throw new HttpException('Not found.', HttpStatus.NOT_FOUND);
    }
    const res: HealthDto = { health: data.health };
    return res;
  }
}
