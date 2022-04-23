import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import { TodoItem } from './todoItem.entity';

@Table({ tableName: 'directory', timestamps: false })
export class Directory extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  name: string;

  @HasMany(() => TodoItem)
  todoItem: TodoItem;
}
