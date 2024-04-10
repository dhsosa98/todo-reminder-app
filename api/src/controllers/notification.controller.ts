import { Controller, Get, Request, Post, UseGuards, Body } from '@nestjs/common';
import { NotificationService } from 'src/services/notification.service';


@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  async getNotifications(@Request() req) {
    return this.notificationService.getNotifications(req.user.userId);
  }

  @Post('read')
  async markAsRead(@Request() req, @Body() body) {
    return this.notificationService.markAsRead(req.user.userId, body.ids);
  }
}