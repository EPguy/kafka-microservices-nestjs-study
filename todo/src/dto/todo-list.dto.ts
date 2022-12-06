import { TodoPageInfoDto } from './todo-page-info.dto';
import { Todo } from '../schemas/todo.schema';

export class TodoListDto {
  todos: Todo[];
  pageInfo: TodoPageInfoDto;
}
