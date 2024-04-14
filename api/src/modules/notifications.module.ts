import { HttpModule, Module, Provider } from "@nestjs/common";
import { DeviceProvider } from "src/providers/device.provider";
import { FirebaseService } from "src/services/firebase.service";
import { NotificationService } from "src/services/notification.service";
import { AuthModule } from "./auth.module";
import { FirebaseModule } from "./firebase.module";
import { NotificationProvider } from "src/providers/notification.provider";
import { ScheduleParserProvider } from "src/providers/scheduleParser.provider";
import { NotificationsProviderFactory } from "src/providers/NotificationsProviders.factory";
import { TelegramService } from "src/services/telegram.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserNotificationProvider } from "src/providers/userNotification.provider.factory";
import { NotificationController } from "src/controllers/notification.controller";


export const telegramConfigProvider: Provider = {
    provide: 'TELEGRAM_CONFIG',
    useFactory: (config) => {
        return {
            BOT_TOKEN: config.get('TELEGRAM_BOT_TOKEN'),
            TELEGRAM_API: config.get('TELEGRAM_API'),
            CHAT_ID: config.get('TELEGRAM_CHAT_ID'),
        };
    },
    inject: [ConfigService]
  };





@Module({
    imports: [AuthModule, FirebaseModule, HttpModule,  ConfigModule.forRoot()],
    controllers: [NotificationController],
    providers: [NotificationService, NotificationsProviderFactory, ...DeviceProvider, ...NotificationProvider, ...UserNotificationProvider, ScheduleParserProvider, TelegramService, telegramConfigProvider],
    exports: [NotificationService, ...NotificationProvider, NotificationsProviderFactory, ...UserNotificationProvider]
})
export class NotificationsModule {}


