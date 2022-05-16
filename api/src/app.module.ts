import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './controllers/auth.controller';
import { JwtAuthGuard } from './guards/auth.guard';
import { AuthModule } from './modules/auth.module';
import { DirectoryModule } from './modules/directory.module';
import { todoItemModule } from './modules/todoItem.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    todoItemModule,
    DirectoryModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
