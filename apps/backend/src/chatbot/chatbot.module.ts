import { Module } from '@nestjs/common';
import { TwitchService } from './twitch.service';
import { PokemonSpawnService } from './pokemon/pokemon-spawn.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TwitchService, PokemonSpawnService],
  exports: [TwitchService, PokemonSpawnService],
})
export class ChatbotModule {}
