import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientKafka, ClientProxy } from '@nestjs/microservices';
import { UserCreateDto } from './dto/auth/user-create.dto';
import { BaseResponseDto } from './dto/base-response.dto';
import { User } from './dto/auth/user.dto';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class UsersController implements OnModuleInit {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientKafka,
  ) {}

  @Post()
  async createUser(
    @Body() userCreateDto: UserCreateDto,
  ): Promise<BaseResponseDto<User>> {
    const createUserResponse: BaseResponseDto<User> = await firstValueFrom(
      this.userServiceClient.send('user_create', userCreateDto),
    );
    return createUserResponse;
  }

  onModuleInit() {
    this.userServiceClient.subscribeToResponseOf('user_create');
  }
}
