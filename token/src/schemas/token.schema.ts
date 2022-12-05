import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TokenDocument = HydratedDocument<Token>;

@Schema()
export class Token {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  token: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
