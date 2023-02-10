import { Module } from '@nestjs/common';
import { HealthCheckModule } from '../healthCheck';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthCheck } from '../entities/healthCheck.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { ChatModule } from '../chat';
import { ChatMuteUserModule } from '../chatMuteUser';
import * as dotenv from 'dotenv';
import { ChatMuteUser } from '../entities/chatMuteUser.entity';

dotenv.config();

const options: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'postgres', //Container name in docker-compose.
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [HealthCheck, ChatMuteUser],
  synchronize: true,
};

@Module({
  imports: [
    TypeOrmModule.forRoot(options),
    HealthCheckModule,
    ChatMuteUserModule,
    ChatModule,
  ],
})
export class AppModule {}
