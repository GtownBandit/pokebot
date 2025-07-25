import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from '../prisma/prisma.service';
import { TwitchService } from './twitch/twitch.service';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [],
  providers: [AppService, PrismaService, TwitchService],
  exports: [PrismaService],
  controllers: [AppController, AuthController],
})
export class AppModule {}
