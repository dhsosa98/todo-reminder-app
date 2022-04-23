import { Module } from '@nestjs/common';
import { DatabaseProviders } from 'src/providers/db.provider';

@Module({
  providers: [...DatabaseProviders],
  exports: [...DatabaseProviders],
})
export class DatabaseModule {}
