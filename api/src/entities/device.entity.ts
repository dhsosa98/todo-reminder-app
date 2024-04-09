import { Table, Column, Model, HasMany, Unique, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Directory } from './directory.entity';
import { TodoItem } from './todoItem.entity';
import { User } from './user.entity';

@Table({ tableName: 'device', timestamps: false })
export class Device extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  deviceId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column
  fdcToken: string;
}
