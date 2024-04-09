import { Provider } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TodoItem } from 'src/entities/todoItem.entity';

export const TodoItemProvider: Provider[] = [
  {
    provide: 'TODOITEM_REPOSITORY',
    useFactory: (eventEmitter: EventEmitter2) => {
      TodoItem.eventEmitter = eventEmitter;
      return TodoItem;
    },
    inject: [EventEmitter2]
  },
];
