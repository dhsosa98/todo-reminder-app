import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Directory } from './directory.entity';
import { User } from './user.entity';

@Table({ tableName: 'todoitem', timestamps: false })
export class TodoItem extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  description: string;

  @Column({ defaultValue: false })
  selected: boolean;


  @Column({ defaultValue: 0 })
  order: number;

  @ForeignKey(() => Directory)
  @Column
  directoryId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => Directory, {
    onDelete: 'CASCADE',
  })
  directory: Directory;
}
