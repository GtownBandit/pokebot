import { Module } from '@nestjs/common';
import { TwitchService } from './twitch.service';
import { PokemonSpawnService } from './pokemon/pokemon-spawn.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PokemonCatchService } from './pokemon/pokemon-catch.service';

@Module({
  imports: [PrismaModule],
  providers: [TwitchService, PokemonSpawnService, PokemonCatchService],
  exports: [TwitchService, PokemonSpawnService, PokemonCatchService],
})
export class ChatbotModule {}
