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
