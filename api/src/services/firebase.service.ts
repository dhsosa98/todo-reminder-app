import { Inject, Injectable } from "@nestjs/common";
import * as firebase from "firebase-admin";
import { NotificationProvider } from "./notification.provider.interface";


@Injectable()
export class FirebaseService implements NotificationProvider {
    constructor(@Inject('FIREBASE_APP') private firebaseApp: firebase.app.App) {}

    async sendNotification(token: string, title: string, body: string) {
        const message = {
            notification: {
                title,
                body
            },
            token,
        };
        try {
            await this.firebaseApp.messaging().send(message);
            console.log("Notification sent successfully");
        } catch (error) {
            console.error("Error sending notification: ", error);
        }
    }
}