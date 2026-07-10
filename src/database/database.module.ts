import { Module } from '@nestjs/common';
import { drizzleProvider } from './database.provider';

@Module({
  providers: [drizzleProvider],
  exports: [drizzleProvider],
})
export class DatabaseModule {}
