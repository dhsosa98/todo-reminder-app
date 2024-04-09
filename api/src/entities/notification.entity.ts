import { Column, Table, Model, AfterUpdate, ForeignKey, BelongsTo, AfterFind } from "sequelize-typescript";
import { TodoItem } from "./todoItem.entity";


@Table({ tableName: 'notification', timestamps: true })
export class Notification extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    notificationId: number;

    @Column
    @ForeignKey(() => TodoItem)
    taskId: number;

    @Column
    userId: number;

    @Column
    title: string;

    @Column
    body: string;

    @Column
    schedule: string;

    @Column
    provider: string;

    @Column
    sentAt: Date;

    @Column
    active: boolean;

    @BelongsTo(() => TodoItem, {
        onDelete: 'CASCADE',
    })
    todoItem: TodoItem;
}
