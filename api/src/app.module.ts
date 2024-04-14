import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/auth.guard';
import { AuthModule } from './modules/auth.module';
import { DirectoryModule } from './modules/directory.module';
import { todoItemModule } from './modules/todoItem.module';
import { AppController } from './app.controller';
import { NotificationsModule } from './modules/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FirebaseModule } from './modules/firebase.module';
import { EventEmitterModule } from '@nestjs/event-emitter';



@Module({
  imports: [
    ConfigModule.forRoot(),
    todoItemModule,
    DirectoryModule,
    AuthModule,
    NotificationsModule,
    ScheduleModule.forRoot(),
    FirebaseModule,
    EventEmitterModule.forRoot()
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
