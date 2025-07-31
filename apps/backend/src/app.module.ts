import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, ChatbotModule, AuthModule],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
