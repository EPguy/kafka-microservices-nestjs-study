import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_DATABASE, DB_HOST, DB_PORT } from '../config';
import { User, UserSchema } from './schemas/user.schema';
@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
