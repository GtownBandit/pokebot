// src/pokemon/pokemon-spawn.service.ts
import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
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

  async spawnRandomPokemon() {
    const randomId = Math.floor(Math.random() * 151) + 1; // Pokémon IDs range from 1 to 151
    const randomLevel = Math.floor(Math.random() * 100) + 1; // Random level between 1 and 100
    const shinyChance = Math.floor(Math.random() * 255) + 1; // Random level between 1 and 255
    const pokemon = await this.prisma.pokemon.findUnique({
      where: { id: randomId },
    });

    if (!pokemon) {
      this.logger.warn(`Pokemon with ID ${randomId} not found`);
      return;
    }

    await this.invalidateActiveSpawnEvent();

    await this.prisma.spawnEvent.create({
      data: {
        channel: process.env.TWITCH_CHANNEL!,
        pokemonInstance: {
          create: {
            pokemon: { connect: { id: pokemon.id } },
            level: randomLevel,
            shiny: shinyChance === 1, // 1 in 255 chance for shiny
          },
        },
      },
    });

    let message = `Ein wildes ${pokemon.displayNameDe} Level ${randomLevel} ${shinyChance === 1 ? '✨Shiny✨ ' : ''}erscheint!`;

    await this.twitchService.sendChatMessage(message);
  }

  async invalidateActiveSpawnEvent() {
    const activeSpawnEvent = await this.prisma.spawnEvent.findFirst({
      where: {
        expiresAt: null,
        channel: process.env.TWITCH_CHANNEL!,
      },
      orderBy: { expiresAt: 'desc' },
    });

    if (activeSpawnEvent) {
      const spawnEvent = await this.prisma.spawnEvent.update({
        where: { id: activeSpawnEvent.id },
        data: { expiresAt: new Date() },
      });
    }
  }
}
