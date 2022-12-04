import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserCreateDto } from './dto/user-create.dto';

@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async searchUserByEmail(params: { email: string }): Promise<User> {
    return this.userModel.findOne(params).exec();
  }

  async createUser(userCreateDto: UserCreateDto): Promise<User> {
    const hashedPassword = await hash(userCreateDto.password, 10);
    return this.userModel.create({
      ...userCreateDto,
      password: hashedPassword,
    });
  }
}
