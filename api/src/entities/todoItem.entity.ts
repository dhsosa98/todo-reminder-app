import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Directory } from './directory.entity';

@Table({ tableName: 'todoitem', timestamps: false })
export class TodoItem extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  description: string;

  @Column({ defaultValue: false })
  selected: boolean;

  @ForeignKey(() => Directory)
  @Column
  directoryId: number;

  @BelongsTo(() => Directory, {
    onDelete: 'CASCADE',
  })
  directory: Directory;
}
