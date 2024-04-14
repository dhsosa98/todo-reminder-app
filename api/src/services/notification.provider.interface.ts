

export interface NotificationProvider {
    sendNotification: (title: string, body: string, token: string) => Promise<void>
}