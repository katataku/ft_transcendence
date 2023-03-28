import { Get, Controller } from '@nestjs/common';
import { HealthCheckService } from './healthCheck.service';
import { HealthDto } from 'src/common/dto/health.dto';
import { Public } from 'src/auth/public.decorator';

@Controller('health')
export class HealthCheckController {
  constructor(private service: HealthCheckService) {}

  @Public()
  @Get()
  get(): Promise<HealthDto> {
    return this.service.get();
  }
}
