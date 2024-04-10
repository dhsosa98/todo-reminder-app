import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  BeforeSave,
  BeforeCreate,
  BeforeUpdate,
  AfterUpdate,
  AfterCreate,
  AfterDestroy,
  HasOne,
  AfterSave,
} from 'sequelize-typescript';
import { Directory } from './directory.entity';
import { User } from './user.entity';
@Table({ tableName: 'todoitem', timestamps: true })
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
  @Column({ allowNull: true })
  directoryId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => Directory, {
    onDelete: 'CASCADE',
  })
  directory: Directory;

  get notification(): any {
    return this.getDataValue('notification');
  }

  set notification(value: any) {
    this.setDataValue('notification', value);
  }
}
