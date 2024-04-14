import { Notification } from 'src/entities/notification.entity';

export const NotificationProvider = [
  {
    provide: 'NOTIFICATION_REPOSITORY',
    useFactory: () => {
      return Notification;
    },
  },
];
