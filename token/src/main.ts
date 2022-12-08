import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { KAFKA_BROKER_PORT, KAFKA_BROKER_HOST } from './config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [`${KAFKA_BROKER_HOST}:${KAFKA_BROKER_PORT}`],
        },
        consumer: {
          groupId: 'token-consumer',
        },
      },
    },
  );
  app.listen();
}
bootstrap();
