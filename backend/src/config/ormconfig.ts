import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

// Check typeORM documentation for more information.
export const ormconfig = new DataSource({
  type: 'postgres',
  host: 'postgres', //Container name in docker-compose.
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  migrations: ['migrations/*.ts'],
});
