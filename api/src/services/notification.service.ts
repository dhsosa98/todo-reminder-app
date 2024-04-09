import { Inject, Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Cron } from "@nestjs/schedule";
import { Op } from "sequelize";
import { Device } from "src/entities/device.entity";
import { Notification } from "src/entities/notification.entity";
import { TodoItem } from "src/entities/todoItem.entity";
import { NotificationProviderFactory } from "src/providers/NotificationsProviders.factory";
import { ScheduleParser } from "src/providers/scheduleParser.provider";



@Injectable()
export class NotificationService {
 
    constructor(
        @Inject('NOTIFICATION_PROVIDER_FACTORY') private notificationProviderFactory: NotificationProviderFactory,
        @Inject('NOTIFICATION_REPOSITORY') private notificationRepository: typeof Notification,
        @Inject('DEVICE_REPOSITORY') private deviceRepository: typeof Device,
        @Inject('SCHEDULE_PARSER') private scheduleNotificationParser: ScheduleParser,
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

    // @Cron('*/15 * * * * *')
    async sendNotificationToUsers() {
        const notifications = await this.notificationRepository.findAll({where: {active: true} });
        const notificationsThatShouldBeSent = notifications.filter((notification) => {
            return this.shouldSendNofication(notification);
        });

        for (const notification of notificationsThatShouldBeSent) {
            const userId = notification.userId;
            if (notification.provider === 'firebase') {
                const devices = await this.deviceRepository.findAll({ where: { userId } });
                for (const device of devices) {
                    await this.sendNotification(notification, device.fdcToken);
                }
                notification.sentAt = this.getActualDate();
                notification.save();
                continue; 
            }
            await this.sendNotification(notification, '');
            notification.sentAt = this.getActualDate();
            notification.save();
        }
    }

    getActualDate() {
        const now = new Date();
        return now;
    }

    shouldSendNofication(notification: Notification) {
        const schedule = this.scheduleNotificationParser.parse(notification.schedule);
        console.log('schedule', schedule);
        const now = this.getActualDate();
        const day = now.getDay();
        const hour = now.getHours();
        const month = now.getMonth()+1;
        const minute = now.getMinutes();
        const monthDay = now.getDate();

        console.log('sentAt', notification.sentAt);

        if (schedule.everyMinutes) {
            const minuteSentAt = notification.sentAt?.getMinutes() || 0;
            return Math.abs(minute - minuteSentAt) >= schedule.everyMinutes;
        } 
        if (schedule.everyHours) {
            const hourSentAt = notification.sentAt?.getHours() || 0;
            return Math.abs(hour - hourSentAt) >= schedule.everyHours;
        } 
        if (schedule.everyDays) {
            const daySentAt = notification.sentAt?.getDate() || 0;
            return minute == schedule.atTime.minute && hour == schedule.atTime.hour && Math.abs(monthDay - daySentAt) >= schedule.everyDays;
        } 
        if (schedule.everyWeeks) {
            const weekNumberSentAt = Math.ceil(notification.sentAt?.getDate() / 7);
            const weekNumber = Math.ceil(monthDay / 7);
            return minute == schedule.atTime.minute && hour == schedule.atTime.hour && day == this.getDayOfWeek(schedule.onDayOfWeek) && Math.abs(weekNumber - weekNumberSentAt) >= schedule.everyWeeks;
        } 
        if (schedule.everyMonths) {
            const sentAtMonth = (notification.sentAt?.getMonth() || -1) + 1;

            if (schedule.onEach){
                return monthDay == schedule?.onEach.day && hour == schedule.atTime.hour && minute == schedule.atTime.minute && Math.abs(month - sentAtMonth) >= schedule.everyMonths;
            }
            const dayOfWeek = this.getDayOfWeek(schedule.onThe.day);
            const position = this.getPosition(schedule.onThe.position);

            const weekNumber = Math.ceil(monthDay / 7);
            const isInDesiredWeek = weekNumber === position;

            if (day === dayOfWeek && isInDesiredWeek){
                return minute == schedule.atTime.minute && hour == schedule.atTime.hour && Math.abs(month - sentAtMonth) >= schedule.everyMonths;
            }
        } else {
            throw new Error('Invalid schedule');
        }
    }

    getPosition(position: string) {
        switch (position) {
            case 'first':
                return 1;
            case 'second':
                return 2;
            case 'third':
                return 3;
            case 'fourth':
                return 4;
            case 'fifth':
                return 5;
            case 'last':
                return 6;
            default:
                throw new Error('Invalid position');
        }
    }

    getDayOfWeek(day: string) {
        switch (day) {
            case 'Mon':
                return 1;
            case 'Tue':
                return 2;
            case 'Wed':
                return 3;
            case 'Thu':
                return 4;
            case 'Fri':
                return 5;
            case 'Sat':
                return 6;
            case 'Sun':
                return 7;
            default:
                throw new Error('Invalid day of week');
        }
    }

    async sendNotification(notification: Notification, token?: string) {
        const { provider, title, body } = notification;
        const notificationProvider = this.notificationProviderFactory.create(provider);
        await notificationProvider.sendNotification(token, title, body);
    }
}