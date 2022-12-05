import { Body, Controller, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { UserCreateDto } from './dto/user-create.dto';
import { BaseResponseDto } from './dto/base-response.dto';
import { User } from './schemas/user.schema';
import { compare } from 'bcrypt';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('user_search_by_id')
  async searchUserById(searchParams: {
    id: string;
  }): Promise<BaseResponseDto<User>> {
    let result: BaseResponseDto<User>;
    if (searchParams.id) {
      const user = await this.appService.searchUserById({
        id: searchParams.id,
      });

      if (user) {
        result = {
          status: HttpStatus.OK,
          message: 'Find user successfully.',
          data: user,
          error: null,
        };
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'User not found.',
          data: null,
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
    return result;
  }

  @MessagePattern('user_search_by_credentials')
  async searchUserByCredentials(searchParams: {
    id: string;
    password: string;
  }): Promise<BaseResponseDto<User>> {
    let result: BaseResponseDto<User>;
    if (searchParams.id && searchParams.password) {
      const user = await this.appService.searchUserById({
        id: searchParams.id,
      });
      if (user) {
        if (await compare(searchParams.password, user.password)) {
          result = {
            status: HttpStatus.OK,
            message: 'Search user by credentials is successfully.',
            data: user,
            error: null,
          };
        } else {
          result = {
            status: HttpStatus.NOT_FOUND,
            message: 'Password is not matched.',
            data: null,
            error: null,
          };
        }
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'Id is not exist.',
          data: null,
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
    return result;
  }

  @MessagePattern('user_create')
  async createUser(
    userCreateDto: UserCreateDto,
  ): Promise<BaseResponseDto<User>> {
    let result: BaseResponseDto<User>;
    try {
      if (userCreateDto) {
        const userById = await this.appService.searchUserById({
          id: userCreateDto.id,
        });
        if (userById) {
          result = {
            status: HttpStatus.CONFLICT,
            message: 'Id already exists.',
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
