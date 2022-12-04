import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { KAFKA_BROKER_PORT } from '../config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [`localhost:${KAFKA_BROKER_PORT}`],
        },
        consumer: {
          groupId: 'user-consumer',
        },
      },
    },
  );
  app.listen();
}
bootstrap();
