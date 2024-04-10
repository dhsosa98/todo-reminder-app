import { Body, Controller, Get, Post } from "@nestjs/common";
import { FirebaseService } from "./services/firebase.service";
import { Public } from "./decorators/public.decorator";
import { NotificationService } from "./services/notification.service";

@Controller()
export class AppController {
  constructor(private notificationService: NotificationService) {}
}