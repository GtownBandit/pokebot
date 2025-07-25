// src/pokemon/pokemon-spawn.service.ts
import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Interval } from '@nestjs/schedule';
import { TwitchService } from '../twitch.service';

@Injectable()
export class PokemonSpawnService implements OnModuleInit {
  private readonly logger = new Logger(PokemonSpawnService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => TwitchService))
    private twitchService: TwitchService,
  ) {}

  async onModuleInit() {
    this.logger.log('PokemonSpawnService initialized');
  }

  @Interval(60000)
  async spawnRandomPokemon() {
    const randomId = Math.floor(Math.random() * 151) + 1; // Pokémon IDs range from 1 to 151
    const randomLevel = Math.floor(Math.random() * 100) + 1; // Random level between 1 and 100
    const pokemon = await this.prisma.pokemon.findUnique({
      where: { id: randomId },
    });

    if (!pokemon) {
      this.logger.warn(`Pokemon with ID ${randomId} not found`);
      return;
    }

    await this.prisma.spawnEvent.create({
      data: {
        pokemonId: pokemon.id,
        level: randomLevel,
        channel: process.env.TWITCH_CHANNEL!,
        expiresAt: new Date(new Date().getTime() + 60 * 1000), // 10 seconds from now
      },
    });

    await this.twitchService.sendChatMessage(
      `Ein wildes ${pokemon.displayNameDe} Level ${randomLevel} erscheint!`,
    );
  }
}
