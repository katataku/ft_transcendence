import { Get, Controller } from '@nestjs/common';
import { HealthCheckService } from './healthCheck.service';
import { HealthDto } from 'src/common/dto/health.dto';

@Controller('health')
export class HealthCheckController {
  constructor(private service: HealthCheckService) {}

  @Get()
  get(): Promise<HealthDto> {
    return this.service.get();
  }
}
