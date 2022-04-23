import { Table, Column, Model } from 'sequelize-typescript';

@Table({ tableName: 'todoitem', timestamps: false })
export class TodoItem extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  description: string;

  @Column({ defaultValue: false })
  selected: boolean;
}
