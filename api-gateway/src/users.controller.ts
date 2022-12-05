import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  OnModuleInit,
  Post,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { UserCreateDto } from './dto/auth/user-create.dto';
import { BaseResponseDto } from './dto/base-response.dto';
import { User } from './dto/auth/user.dto';
import { firstValueFrom } from 'rxjs';
import { UserLoginDto } from './dto/auth/user-login.dto';

@Controller('users')
export class UsersController implements OnModuleInit {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientKafka,
    @Inject('TOKEN_SERVICE') private readonly tokenServiceClient: ClientKafka,
  ) {}

  @Post('/login')
  async login(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<BaseResponseDto<string>> {
    const getUserResponse: BaseResponseDto<User> = await firstValueFrom(
      this.userServiceClient.send('user_search_by_credentials', userLoginDto),
    );

    if (getUserResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getUserResponse.message,
          data: null,
          errors: null,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const createTokenResponse: BaseResponseDto<string> = await firstValueFrom(
      this.tokenServiceClient.send('token_create', {
        userId: getUserResponse.data.id,
      }),
    );

    return {
      status: HttpStatus.OK,
      data: createTokenResponse.data,
      message: 'You are successfully logged in.',
    };
  }

  @Post()
  async createUser(
    @Body() userCreateDto: UserCreateDto,
  ): Promise<BaseResponseDto<User>> {
    const createUserResponse: BaseResponseDto<User> = await firstValueFrom(
      this.userServiceClient.send('user_create', userCreateDto),
    );
    return createUserResponse;
  }

  async onModuleInit() {
    this.userServiceClient.subscribeToResponseOf('user_create');
    this.userServiceClient.subscribeToResponseOf('user_search_by_credentials');
    this.tokenServiceClient.subscribeToResponseOf('token_create');
  }
}
