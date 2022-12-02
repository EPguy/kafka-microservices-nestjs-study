import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderRequestDto } from './create-order-request.dto.';
import { ClientKafka } from '@nestjs/microservices';
import { OrderCreatedEvent } from './order-created-event';

@Injectable()
export class AppService {
  constructor(
    @Inject('BILLING_SERVICE') private readonly billingClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  createOrder({ userId, price }: CreateOrderRequestDto) {
    this.billingClient.emit(
      'order_created',
      new OrderCreatedEvent('123', userId, price),
    );
  }
}
