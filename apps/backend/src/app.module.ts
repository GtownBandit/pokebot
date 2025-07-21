import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
  controllers: [AppController],
})
export class AppModule {}
