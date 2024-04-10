import { Column, Table, Model, AfterUpdate, ForeignKey, BelongsTo, AfterFind } from "sequelize-typescript";
import { User } from "./user.entity";
import { Notification } from "./notification.entity";


@Table({ tableName: 'user_notification', timestamps: true })
export class UserNotification extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;
    
    @Column
    @ForeignKey(() => User)
    userId: number;

    @ForeignKey(() => Notification)
    notificationId: number;

    @BelongsTo(() => Notification, {
        onDelete: 'CASCADE',
    })
    notification: Notification;


    @BelongsTo(() => User, {
        onDelete: 'CASCADE',
    })
    user: User;

    @Column
    read: boolean;

    @Column
    sentAt: Date;
}
