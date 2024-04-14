import { UserNotification } from "src/entities/userNotification.entity";

export const UserNotificationProvider = [
  {
    provide: 'USER_NOTIFICATION_REPOSITORY',
    useValue: UserNotification,
  },
];
