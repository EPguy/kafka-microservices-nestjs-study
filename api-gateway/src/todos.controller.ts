import {
  Body,
  Controller, Delete,
  Get,
  Inject,
  OnModuleInit,
  Param, Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthorizedRequest } from './dto/common/authorized-request';
import { BaseResponseDto } from './dto/base-response.dto';
import { TodoListDto } from './dto/todo/todo-list.dto';
import { firstValueFrom } from 'rxjs';
import { TodoPaginationDto } from './dto/todo/todo-pagination.dto';
import { Authorization } from './decorators/authorization.decorator';
import { TodoIdDto } from './dto/todo/todo-id.dto';
import { Todo } from './dto/todo/todo.dto';
import { TodoCompleteDto } from './dto/todo/todo-complete.dto';
import { TodoCreateDto } from './dto/todo/todo-create.dto';
import { TodoUpdateDto } from './dto/todo/todo-update.dto';

@Controller('todos')
export class TodosController implements OnModuleInit {
  constructor(
    @Inject('TODO_SERVICE') private readonly todoServiceClient: ClientKafka,
  ) {}

  @Post()
  @Authorization(true)
  async createTodo(
    @Req() request: AuthorizedRequest,
    @Body() todoCreateDto: TodoCreateDto,
  ): Promise<BaseResponseDto<Todo>> {
    const userInfo = request.user;

    const createTodoResponse: BaseResponseDto<Todo> = await firstValueFrom(
      this.todoServiceClient.send('todo_create', {
        todoCreateDto,
        userId: userInfo.id,
      }),
    );

    return createTodoResponse;
  }

  @Get()
  @Authorization(true)
  async getTodos(
    @Req() request: AuthorizedRequest,
    @Query() todoPaginationDto: TodoPaginationDto,
  ): Promise<BaseResponseDto<TodoListDto>> {
    const userInfo = request.user;
    const todosResponse: BaseResponseDto<TodoListDto> = await firstValueFrom(
      this.todoServiceClient.send('todo_search_by_paging', {
        todoPaginationDto,
        userId: userInfo.id,
      }),
    );

    return todosResponse;
  }

  @Get(':_id')
  @Authorization(true)
  async getTodo(
    @Req() request: AuthorizedRequest,
    @Param() params: TodoIdDto,
  ): Promise<BaseResponseDto<Todo>> {
    const userInfo = request.user;

    const todoResponse: BaseResponseDto<Todo> = await firstValueFrom(
      this.todoServiceClient.send('todo_search_by_id', {
        todoIdDto: params,
        userId: userInfo.id,
      }),
    );

    return todoResponse;
  }

  @Put('/complete/:_id')
  @Authorization(true)
  async completeTodo(
    @Req() request: AuthorizedRequest,
    @Param() params: TodoIdDto,
    @Body() todoCompleteDto: TodoCompleteDto,
  ): Promise<BaseResponseDto<Todo>> {
    const userInfo = request.user;

    const completeTodoResponse: BaseResponseDto<Todo> = await firstValueFrom(
      this.todoServiceClient.send('todo_complete', {
        todoCompleteDto,
        _id: params,
        userId: userInfo.id,
      }),
    );

    return completeTodoResponse;
  }

  @Delete(':_id')
  @Authorization(true)
  async deleteTodo(
    @Req() request: AuthorizedRequest,
    @Param() params: TodoIdDto,
  ): Promise<BaseResponseDto<Todo>> {
    const userInfo = request.user;

    const deleteTodoResponse: BaseResponseDto<Todo> = await firstValueFrom(
      this.todoServiceClient.send('todo_delete', {
        todoIdDto: params,
        userId: userInfo.id,
      }),
    );

    return deleteTodoResponse;
  }

  @Put(':_id')
  @Authorization(true)
  async updateTodo(
    @Req() request: AuthorizedRequest,
    @Param() params: TodoIdDto,
    @Body() todoUpdateDto: TodoUpdateDto,
  ): Promise<BaseResponseDto<Todo>> {
    const userInfo = request.user;

    const updateTodoResponse: BaseResponseDto<Todo> = await firstValueFrom(
      this.todoServiceClient.send('todo_update', {
        todoUpdateDto,
        todoIdDto: params,
        userId: userInfo.id,
      }),
    );

    return updateTodoResponse;
  }

  async onModuleInit() {
    this.todoServiceClient.subscribeToResponseOf('todo_search_by_paging');
    this.todoServiceClient.subscribeToResponseOf('todo_search_by_id');
    this.todoServiceClient.subscribeToResponseOf('todo_create');
    this.todoServiceClient.subscribeToResponseOf('todo_complete');
    this.todoServiceClient.subscribeToResponseOf('todo_delete');
    this.todoServiceClient.subscribeToResponseOf('todo_update');
  }
}
