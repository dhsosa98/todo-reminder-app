import { Table, Column, Model, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { TodoItem } from './todoItem.entity';
import { User } from './user.entity';

@Table({ tableName: 'directory', timestamps: false })
export class Directory extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  name: string;

  @ForeignKey(() => Directory)
  @Column
  parentId: number;

  @HasMany(() => Directory)
  children: Directory[];

  @HasMany(() => TodoItem)
  todoItem: TodoItem[];

  @BelongsTo(() => User, {
    onDelete: 'CASCADE',
  })
  user: User;

  parent?: Directory;

  @ForeignKey(() => User)
  @Column
  userId: number;
}
