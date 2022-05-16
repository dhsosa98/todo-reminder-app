import { Table, Column, Model, HasMany, Unique } from 'sequelize-typescript';
import { Directory } from './directory.entity';
import { TodoItem } from './todoItem.entity';

@Table({ tableName: 'user', timestamps: false })
export class User extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Unique
  @Column
  username: string;

  @Column
  name: string;

  @Column
  surname: string;

  @Column
  password: string;

  @Column({ defaultValue: 'user' })
  role: string;

  @HasMany(() => Directory)
  directory: Directory;

  @HasMany(() => TodoItem)
  todoItem: TodoItem;
}
