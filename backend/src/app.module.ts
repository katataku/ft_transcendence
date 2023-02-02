import { Module } from '@nestjs/common';
import { HealthCheckModulle } from './healthCheck/healthCheck.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthCheck } from './healthCheck/healthCheck.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const options: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'root',
  password: 'root',
  database: 'transcendence',
  entities: [HealthCheck],
  synchronize: true
}

@Module({
  imports: [
    TypeOrmModule.forRoot(options),
    HealthCheckModulle
  ]
})
export class AppModule {}
