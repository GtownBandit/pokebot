import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from '../prisma/prisma.service';
import { TwitchService } from './twitch/twitch.service';

@Module({
  imports: [],
  providers: [AppService, PrismaService, TwitchService],
  exports: [PrismaService],
  controllers: [AppController],
})
export class AppModule {}
