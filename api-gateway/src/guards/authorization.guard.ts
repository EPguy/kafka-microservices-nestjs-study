import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { firstValueFrom, Observable } from 'rxjs';
import { ClientKafka } from '@nestjs/microservices';
import { BaseResponseDto } from '../dto/base-response.dto';

@Injectable()
export class AuthGuard implements CanActivate, OnModuleInit {
  constructor(
    private readonly reflector: Reflector,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientKafka,
    @Inject('TOKEN_SERVICE') private readonly tokenServiceClient: ClientKafka,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const secured = this.reflector.get<string[]>(
      'secured',
      context.getHandler(),
    );

    if (!secured) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userTokenInfo: BaseResponseDto<string> = await firstValueFrom(
      this.tokenServiceClient.send('token_decode', {
        token: request.headers.authorization,
      }),
    );

    if (!userTokenInfo || !userTokenInfo.data) {
      throw new HttpException(
        {
          message: userTokenInfo.message,
          data: null,
          errors: null,
        },
        userTokenInfo.status,
      );
    }

    const userInfo = await firstValueFrom(
      this.userServiceClient.send('user_search_by_id', userTokenInfo.data),
    );

    request.user = userInfo.user;
    return true;
  }

  async onModuleInit() {
    this.tokenServiceClient.subscribeToResponseOf('token_decode');
    this.userServiceClient.subscribeToResponseOf('user_search_by_id');
  }
}
