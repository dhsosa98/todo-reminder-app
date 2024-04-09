import { HttpService, Inject, Injectable } from "@nestjs/common";
import * as firebase from "firebase-admin";
import { NotificationProvider } from "./notification.provider.interface";


@Injectable()
export class TelegramService implements NotificationProvider {
    constructor(@Inject('TELEGRAM_CONFIG') private telegramConfig: {
        TELEGRAM_API: string,
        CHAT_ID: string
        BOT_TOKEN: string
    },
    private readonly httpService: HttpService) {}

    async sendNotification(token: string, title: string, body: string) {
        const message = `${title} ${body}`;
        try {
            const response = await this.httpService.post(
              `${this.telegramConfig.TELEGRAM_API}/bot${this.telegramConfig.BOT_TOKEN}/sendMessage?chat_id=${this.telegramConfig.CHAT_ID}&text=${message}`
            ).toPromise();
            console.log("Notification sent successfully");
            console.log(response.data);
          } catch (e) {
            console.log(e);
          }
    }
}