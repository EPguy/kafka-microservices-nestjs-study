import { Controller, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { BaseResponseDto } from './dto/base-response.dto';
import { Todo } from './schemas/todo.schema';
import { TodoCreateDto } from './dto/todo-create.dto';
import { TodoCompleteDto } from './dto/todo-complete.dto';
import { TodoPaginationDto } from './dto/todo-pagination.dto';
import { TodoListDto } from './dto/todo-list.dto';
import { TodoIdDto } from './dto/todo-id.dto';
import { TodoUpdateDto } from './dto/todo-update.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('todo_search_by_paging')
  async searchTodoByPaging(params: {
    todoPaginationDto: TodoPaginationDto;
    userId: string;
  }): Promise<BaseResponseDto<TodoListDto>> {
    let result: BaseResponseDto<TodoListDto>;
    if (params.todoPaginationDto) {
      try {
        const todoList = await this.appService.searchTodoByPaging(
          params.todoPaginationDto,
          params.userId,
        );
        result = {
          status: HttpStatus.OK,
          message: 'Todo loaded successfully.',
          data: todoList,
          error: null,
        };
      } catch (e) {
        result = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Todo loaded failed.',
          data: null,
          error: e,
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

  @MessagePattern('todo_search_by_id')
  async searchTodoById(params: {
    todoIdDto: TodoIdDto;
    userId: string;
  }): Promise<BaseResponseDto<Todo>> {
    let result: BaseResponseDto<Todo>;
    if (params.todoIdDto) {
      try {
        const todo = await this.appService.searchTodoById(
          params.todoIdDto,
        );
        if (todo) {
          if (todo.userId === params.userId) {
            result = {
              status: HttpStatus.OK,
              message: 'Todo loaded successfully.',
              data: todo,
              error: null,
            };
          } else {
            result = {
              status: HttpStatus.FORBIDDEN,
              message: 'You do not have permission.',
              data: null,
              error: null,
            };
          }
        } else {
          result = {
            status: HttpStatus.NOT_FOUND,
            message: 'Todo not found.',
            data: null,
            error: null,
          };
        }
      } catch (e) {
        result = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Todo loaded failed.',
          data: null,
          error: e,
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

  @MessagePattern('todo_create')
  async createTodo(params: {
    todoCreateDto: TodoCreateDto;
    userId: string;
  }): Promise<BaseResponseDto<Todo>> {
    let result: BaseResponseDto<Todo>;
    if (params.todoCreateDto) {
      try {
        const createdTodo = await this.appService.createTodo(
          params.todoCreateDto,
          params.userId,
        );
        result = {
          status: HttpStatus.CREATED,
          message: 'Todo created successfully.',
          data: createdTodo,
          error: null,
        };
      } catch (e) {
        result = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Todo create failed.',
          data: null,
          error: e,
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

  @MessagePattern('todo_complete')
  async completeTodo(params: {
    todoCompleteDto: TodoCompleteDto;
    todoIdDto: TodoIdDto;
    userId: string;
  }): Promise<BaseResponseDto<Todo>> {
    let result: BaseResponseDto<Todo>;
    if (params.todoCompleteDto) {
      try {
        const todo = await this.appService.searchTodoById(params.todoIdDto);
        if (todo) {
          if (todo.userId === params.userId) {
            const updatedTodo = await this.appService.completeTodo(
              params.todoCompleteDto,
              params.todoIdDto,
              params.userId,
            );
            result = {
              status: HttpStatus.OK,
              message: 'Todo updated successfully.',
              data: updatedTodo,
              error: null,
            };
          } else {
            result = {
              status: HttpStatus.FORBIDDEN,
              message: 'You do not have permission.',
              data: null,
              error: null,
            };
          }
        } else {
          result = {
            status: HttpStatus.NOT_FOUND,
            message: 'Todo not found.',
            data: null,
            error: null,
          };
        }
      } catch (e) {
        result = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Todo update failed.',
          data: null,
          error: e,
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

  @MessagePattern('todo_delete')
  async deleteTodo(params: {
    todoIdDto: TodoIdDto;
    userId: string;
  }): Promise<BaseResponseDto<Todo>> {
    let result: BaseResponseDto<Todo>;
    if (params.todoIdDto) {
      try {
        const todo = await this.appService.searchTodoById(params.todoIdDto);
        if (todo) {
          if (todo.userId === params.userId) {
            const deletedTodo = await this.appService.deleteTodo(
              params.todoIdDto,
              params.userId,
            );
            result = {
              status: HttpStatus.OK,
              message: 'Todo deleted successfully.',
              data: deletedTodo,
              error: null,
            };
          } else {
            result = {
              status: HttpStatus.FORBIDDEN,
              message: 'You do not have permission.',
              data: null,
              error: null,
            };
          }
        } else {
          result = {
            status: HttpStatus.NOT_FOUND,
            message: 'Todo not found.',
            data: null,
            error: null,
          };
        }
      } catch (e) {
        result = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Todo delete failed.',
          data: null,
          error: e,
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

  @MessagePattern('todo_update')
  async updateTodo(params: {
    todoUpdateDto: TodoUpdateDto;
    todoIdDto: TodoIdDto;
    userId: string;
  }): Promise<BaseResponseDto<Todo>> {
    let result: BaseResponseDto<Todo>;
    if (params.todoIdDto) {
      try {
        const todo = await this.appService.searchTodoById(params.todoIdDto);
        if (todo) {
          if (todo.userId === params.userId) {
            const updatedTodo = await this.appService.updateTodo(
              params.todoUpdateDto,
              params.todoIdDto,
              params.userId,
            );
            result = {
              status: HttpStatus.OK,
              message: 'Todo updated successfully.',
              data: updatedTodo,
              error: null,
            };
          } else {
            result = {
              status: HttpStatus.FORBIDDEN,
              message: 'You do not have permission.',
              data: null,
              error: null,
            };
          }
        } else {
          result = {
            status: HttpStatus.NOT_FOUND,
            message: 'Todo not found.',
            data: null,
            error: null,
          };
        }
      } catch (e) {
        result = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Todo update failed.',
          data: null,
          error: e,
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
