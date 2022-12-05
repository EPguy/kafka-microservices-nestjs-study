import { Body, Controller, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { UserCreateDto } from './dto/user-create.dto';
import { BaseResponseDto } from './dto/base-response.dto';
import { User } from './schemas/user.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('user_create')
  async createUser(
    userCreateDto: UserCreateDto,
  ): Promise<BaseResponseDto<User>> {
    let result: BaseResponseDto<User>;
    try {
      if (userCreateDto) {
        const userByEmail = await this.appService.searchUserByEmail({
          email: userCreateDto.email,
        });
        if (userByEmail) {
          result = {
            status: HttpStatus.CONFLICT,
            message: 'Email already exists.',
            data: null,
            error: null,
          };
        } else {
          const createdUser = await this.appService.createUser(userCreateDto);
          delete createdUser.password;
          result = {
            status: HttpStatus.CREATED,
            message: 'User created successfully.',
            data: createdUser,
            error: null,
          };
        }
      } else {
        result = {
          status: HttpStatus.BAD_REQUEST,
          message: 'Wrong parameters.',
          data: null,
          error: null,
        };
      }
    } catch (e) {
      result = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'User create failed.',
        data: null,
        error: e,
      };
    }
    return result;
  }
}
