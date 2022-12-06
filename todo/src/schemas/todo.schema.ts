import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TodoDoucment = HydratedDocument<Todo>;

@Schema()
export class Todo {
  _id: Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, default: false })
  isCompleted: boolean;

  @Prop({ required: true, default: false })
  isDeleted: boolean;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
