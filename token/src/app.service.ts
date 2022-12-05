import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from './schemas/token.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}

  async decodeToken(token: string): Promise<string> {
    let result = null;
    try {
      const findToken = await this.tokenModel
        .findOne({
          token,
        })
        .exec();
      if (findToken) {
        const tokenData = this.jwtService.decode(findToken.token) as {
          exp: number;
          userId: string;
        };
        if (tokenData && tokenData.exp > Math.floor(+new Date() / 1000)) {
          result = tokenData.userId;
        }
      }
    } catch (e) {
      result = null;
    }
    return result;
  }

  async createToken(userId: string): Promise<Token> {
    const createdToken = this.jwtService.sign(
      {
        userId,
      },
      {
        expiresIn: 30 * 24 * 60 * 60,
      },
    );

    return this.tokenModel.create({
      userId,
      token: createdToken,
    });
  }
}
