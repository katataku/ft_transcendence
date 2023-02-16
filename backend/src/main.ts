import { NestFactory } from '@nestjs/core';
import { AppModule } from './common/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); //CORS
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3001);
}
bootstrap();
