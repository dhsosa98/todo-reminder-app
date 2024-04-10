import { Inject, Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Cron } from "@nestjs/schedule";
import { Op } from "sequelize";
import { Device } from "src/entities/device.entity";
import { Notification } from "src/entities/notification.entity";
import { TodoItem } from "src/entities/todoItem.entity";
import { UserNotification } from "src/entities/userNotification.entity";
import { NotificationProviderFactory } from "src/providers/NotificationsProviders.factory";
import { ScheduleParser } from "src/providers/scheduleParser.provider";



@Injectable()
export class NotificationService {
 
    constructor(
        @Inject('NOTIFICATION_REPOSITORY') private notificationRepository: typeof Notification,
        @Inject('USER_NOTIFICATION_REPOSITORY') private userNotificationRepository: typeof UserNotification,
    ) {}


    @OnEvent('task.created')
    async createNotification(model: TodoItem) {
        const { description, userId, id: taskId, notification: modelNotification } = model;
        if (!modelNotification) {
            return;
        }
        const {providers, schedule, active} = modelNotification;
        const title = 'Reminder: ';
        const body = description;
        await this.notificationRepository.destroy({where: {taskId}});
        for (const provider of providers) {
            const notification = new Notification();
            notification.title = title;
            notification.body = body;
            notification.provider = provider;
            notification.schedule = schedule;
            notification.active = active;
            notification.userId = userId;
            notification.taskId = taskId;
            await notification.save();
        }
    }


    @OnEvent('task.updated')
    async updateNotification(model: TodoItem) {
        console.log('task updated', model);
        const { description, userId, id: taskId, notification: modelNotification } = model;
        if (!modelNotification) {
            return;
        }
        const {providers, schedule, active} = modelNotification;
        const title = 'Reminder: ';
        const body = description;
        await this.notificationRepository.destroy({where: {taskId}});
        for (const provider of providers) {
            const notification = new Notification();
            notification.title = title;
            notification.body = body;
            notification.provider = provider;
            notification.schedule = schedule;
            notification.active = active;
            notification.userId = userId;
            notification.taskId = taskId;
            await notification.save();
        }
    }

    @OnEvent('task.deleted')
    async deleteNotification(model: TodoItem) {
        const { id: taskId } = model;
        await this.notificationRepository.destroy({where: {taskId}});
    }

    async getNotifications(userId: number): Promise<UserNotification[]> {
        return await this.userNotificationRepository.findAll<UserNotification>({where: {userId}, include: [Notification], order: [['sentAt', 'DESC']]});
        // return [{
        //     userId: 1,
        //     notificationId: 1,
        //     sentAt: new Date(),
        //     read: false,
        //     notification: {
        //             title: 'Reminder',
        //             body: 'Go to the gym',
        //             provider: 'email',
        //             schedule: '2021-09-20T10:00:00Z',
        //             active: true
        //       }
        //     },
        //     {
        //         userId: 1,
        //         notificationId: 1,
        //         sentAt: new Date(),
        //         read: false,
        //         notification: {
        //                 title: 'Reminder',
        //                 body: 'Go to the city',
        //                 provider: 'email',
        //                 schedule: '2021-09-20T10:00:00Z',
        //                 active: true
        //           }
        //     },
        //     {
        //         userId: 1,
        //         notificationId: 2,
        //         sentAt: new Date(),
        //         read: true,
        //         notification: {
        //                 title: 'Reminder',
        //                 body: 'Go to the park',
        //                 provider: 'email',
        //                 schedule: '2021-09-20T10:00:00Z',
        //                 active: true
        //           }
        //     }
        // ] as any;
    }

    async markAsRead(userId: number, ids: number[]): Promise<UserNotification[]> {
        await this.userNotificationRepository.update({read: true}, {where: {userId, id: {
            [Op.in]: ids
        }}});
        return await this.userNotificationRepository.findAll<UserNotification>({where: {userId}});
    }

}