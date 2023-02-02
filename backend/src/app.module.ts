import { Module } from '@nestjs/common';
import { HealthCheckModulle } from './healthCheck/healthCheck.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthCheck } from './healthCheck/healthCheck.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

require('dotenv').config()

const options: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'postgres', //Container name in docker-compose.
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
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
