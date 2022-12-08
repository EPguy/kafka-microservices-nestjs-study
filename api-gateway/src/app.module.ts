import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KAFKA_BROKER_PORT, KAFKA_BROKER_HOST } from './config';
import { UsersController } from './users.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/authorization.guard';
import { TodosController } from './todos.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'user',
            brokers: [`${KAFKA_BROKER_HOST}:${KAFKA_BROKER_PORT}`],
          },
          consumer: {
            groupId: 'user-consumer',
          },
        },
      },
      {
        name: 'TOKEN_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'token',
            brokers: [`${KAFKA_BROKER_HOST}:${KAFKA_BROKER_PORT}`],
          },
          consumer: {
            groupId: 'token-consumer',
          },
        },
      },
      {
        name: 'TODO_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'todo',
            brokers: [`${KAFKA_BROKER_HOST}:${KAFKA_BROKER_PORT}`],
          },
          consumer: {
            groupId: 'todo-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [TodosController, UsersController, AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
