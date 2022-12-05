import { Controller, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { BaseResponseDto } from './dto/base-response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('token_decode')
  async decodeToken(data: { token: string }): Promise<BaseResponseDto<string>> {
    let result: BaseResponseDto<string>;
    if (data.token) {
      try {
        const tokenData = await this.appService.decodeToken(data.token);
        result = {
          status: tokenData ? HttpStatus.OK : HttpStatus.UNAUTHORIZED,
          message: tokenData ? 'Token decoded successfully.' : 'Unauthorized.',
          data: tokenData,
          error: null,
        };
      } catch (e) {
        result = {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized.',
          data: null,
          error: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized.',
        data: null,
        error: null,
      };
    }
    return result;
  }

  @MessagePattern('token_create')
  async createToken(data: {
    userId: string;
  }): Promise<BaseResponseDto<string>> {
    let result: BaseResponseDto<string>;
    if (data && data.userId) {
      try {
        const createdToken = await this.appService.createToken(data.userId);
        result = {
          status: HttpStatus.CREATED,
          message: 'Token created successfully',
          data: createdToken.token,
          error: null,
        };
      } catch (e) {
        result = {
          status: HttpStatus.BAD_REQUEST,
          message: 'Token create failed.',
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
}
