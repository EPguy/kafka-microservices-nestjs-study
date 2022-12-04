import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { API_GATEWAY_PORT } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(API_GATEWAY_PORT);
}
bootstrap();
