import { Injectable } from '@nestjs/common';
import { Todo, TodoDoucment } from './schemas/todo.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TodoCreateDto } from './dto/todo-create.dto';
import { TodoCompleteDto } from './dto/todo-complete.dto';
import { TodoPaginationDto } from './dto/todo-pagination.dto';
import { TodoPageInfoDto } from './dto/todo-page-info.dto';
import { TodoListDto } from './dto/todo-list.dto';
import { TodoIdDto } from './dto/todo-id.dto';
import { TodoUpdateDto } from './dto/todo-update.dto';

@Injectable()
export class AppService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDoucment>) {}

  async searchTodoByPaging(
    todoPaginationDto: TodoPaginationDto,
    userId: string,
  ): Promise<TodoListDto> {
    const todos = await this.findByPaging(todoPaginationDto, userId);
    const endCursor =
      todos.length > 0 ? todos[todos.length - 1]._id.toString() : null;
    const hasNextPage =
      todos.length > 0
        ? await this.existsByIdOlderThan(endCursor, userId)
        : false;
    const pageInfo: TodoPageInfoDto = {
      hasNextPage,
      endCursor,
    };
    return {
      todos,
      pageInfo,
    };
  }

  async searchTodoById({ _id }: TodoIdDto): Promise<Todo> {
    return await this.todoModel
      .findOne({
        _id,
      })
      .exec();
  }

  async createTodo({ title }: TodoCreateDto, userId: string): Promise<Todo> {
    return await this.todoModel.create({
      title,
      userId,
    });
  }

  async completeTodo(
    { isCompleted }: TodoCompleteDto,
    { _id }: TodoIdDto,
    userId: string,
  ): Promise<Todo> {
    return await this.todoModel
      .findOneAndUpdate(
        {
          _id,
          userId,
        },
        {
          isCompleted,
        },
        { new: true },
      )
      .exec();
  }

  async deleteTodo({ _id }: TodoIdDto, userId: string): Promise<Todo> {
    return await this.todoModel
      .findOneAndUpdate(
        {
          _id,
          userId,
        },
        {
          isDeleted: true,
        },
        { new: true },
      )
      .exec();
  }

  async updateTodo(
    { title }: TodoUpdateDto,
    { _id }: TodoIdDto,
    userId: string,
  ): Promise<Todo> {
    return await this.todoModel
      .findOneAndUpdate(
        {
          _id,
          userId,
        },
        {
          title,
        },
        { new: true },
      )
      .exec();
  }

  private async existsByIdOlderThan(
    endCursor: string,
    userId: string,
  ): Promise<boolean> {
    return (
      (await this.todoModel.count({
        isDeleted: false,
        userId,
        _id: { $lt: endCursor },
      })) > 0
    );
  }

  private async findByPaging(
    todoPagination: TodoPaginationDto,
    userId: string,
  ): Promise<Todo[]> {
    return this.todoModel
      .find(
        todoPagination.cursor
          ? {
              isDeleted: false,
              userId,
              _id: { $lt: todoPagination.cursor },
            }
          : {
              userId,
              isDeleted: false,
            },
      )
      .sort({
        _id: -1,
      })
      .limit(todoPagination.numTodos)
      .exec();
  }
}
