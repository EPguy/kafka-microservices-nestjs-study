import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from './config';
import { Token, TokenSchema } from './schemas/token.schema';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
    ),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    JwtModule.register({
      secret: 'Mkfmqkmas<daksdmq#($*!(*$@).qwlea',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
