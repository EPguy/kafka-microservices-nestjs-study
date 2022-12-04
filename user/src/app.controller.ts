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
          result = new BaseResponseDto(
            HttpStatus.CONFLICT,
            'Email already exists.',
            null,
            null,
          );
        }
        const createdUser = await this.appService.createUser(userCreateDto);
        delete createdUser.password;
        result = new BaseResponseDto(
          HttpStatus.CREATED,
          'User created successfully.',
          createdUser,
          null,
        );
      } else {
        result = new BaseResponseDto(
          HttpStatus.BAD_REQUEST,
          'Wrong parameters.',
          null,
          null,
        );
      }
    } catch (e) {
      result = new BaseResponseDto(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'User create failed.',
        null,
        e,
      );
    }
    return result;
  }
}
