import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { OrderCreatedEvent } from './order-created.event';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('order_created')
  handleOrderCreated(data: OrderCreatedEvent) {
    console.log('data : ' + data.userId);
    this.appService.handleOrderCreated(data);
  }

  onModuleInit() {
    this.authClient.subscribeToResponseOf('get_user');
  }
}
