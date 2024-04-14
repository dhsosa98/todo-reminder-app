import { Injectable, Provider } from "@nestjs/common";
import { NotificationProvider } from "./notification.provider";
import { FirebaseService } from "src/services/firebase.service";
import { TelegramService } from "src/services/telegram.service";







@Injectable()
export class NotificationProviderFactory {
    public static fireBaseService: FirebaseService;   

    public static telegramService: TelegramService;
    
    create(provider: string) {
        switch (provider) {
            case 'firebase':
                return NotificationProviderFactory.fireBaseService;
            case 'telegram':
                return NotificationProviderFactory.telegramService;
            default:
                throw new Error('Provider not found');
        }
    }
}

export const NotificationsProviderFactory = {
    provide: 'NOTIFICATION_PROVIDER_FACTORY',
    useFactory: (firebase, telegram) => {
        NotificationProviderFactory.fireBaseService = firebase;
        NotificationProviderFactory.telegramService = telegram;
        return new NotificationProviderFactory();
    },
    inject: [FirebaseService, TelegramService]
} as Provider;