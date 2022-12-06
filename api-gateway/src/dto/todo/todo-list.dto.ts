import { TodoPageInfoDto } from './todo-page-info.dto';
import { Todo } from './todo.dto';

export class TodoListDto {
  todos: Todo[];
  pageInfo: TodoPageInfoDto;
}
