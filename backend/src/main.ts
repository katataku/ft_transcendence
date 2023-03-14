import { NestFactory } from '@nestjs/core';
import { AppModule } from './common/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as BodyParser from 'body-parser';
import * as dotenv from 'dotenv'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config({ path: '.env' });
  dotenv.config({ path: '.env_secret' });
  app.enableCors(); //CORS
  app.useGlobalPipes(new ValidationPipe());
  app.use(BodyParser.json({ limit: '50mb' }));
  await app.listen(3001);
}
bootstrap();
