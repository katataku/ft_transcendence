import { Module } from '@nestjs/common';
import { HealthCheck } from '../entity/healthCheck.entity';
import { HealthCheckService } from './healthCheck.service';
import { HealthCheckController } from './healthCheck.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([HealthCheck])],
  controllers: [HealthCheckController],
  providers: [HealthCheckService],
})
export class HealthCheckModule {}
