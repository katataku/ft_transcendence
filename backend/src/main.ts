import { NestFactory } from '@nestjs/core';
import { AppModule } from './common/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as BodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); //CORS
  app.useGlobalPipes(new ValidationPipe());
  app.use(BodyParser.json({ limit: '50mb' }));
  await app.listen(3001);
}
bootstrap();
