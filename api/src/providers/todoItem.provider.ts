import { TodoItem } from 'src/entities/todoItem.entity';

export const TodoItemProvider = [
  {
    provide: 'TODOITEM_REPOSITORY',
    useValue: TodoItem,
  },
];
