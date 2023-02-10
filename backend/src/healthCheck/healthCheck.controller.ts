import { Get, Post, Delete, Controller } from '@nestjs/common';
import { HealthCheck } from '../entities/healthCheck.entity';
import { HealthCheckService } from './healthCheck.service';

@Controller('health')
export class HealthCheckController {
  constructor(private service: HealthCheckService) {}

  @Get()
  get(): Promise<HealthCheck> {
    return this.service.getLatest();
  }

  @Post()
  post() {
    this.service.create();
  }

  @Delete()
  delete() {
    this.service.deleteLatest();
  }
}
