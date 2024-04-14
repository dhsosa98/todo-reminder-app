export interface IUserNotification {
    id: number;
    userId: number;
    notifificationId: number;
    sentAt: Date;
    read: boolean;
    notification: {
        active: boolean,
        schedule: string,
        title: string,
        body: string,
    }
};