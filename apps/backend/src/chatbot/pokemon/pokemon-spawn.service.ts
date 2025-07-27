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
import { PokemonRandomizer } from './helpers/spawn-helpers/pokemon-randomizer.helper';
import { PokemonMessageFormatter } from './helpers/spawn-helpers/pokemon-message-formatter.helper';

// --- Types and Interfaces ---
import { Pokemon, PokemonSpecies } from '@pokebot/prisma';

// Gender type for clarity
export type PokemonGender = 'MALE' | 'FEMALE' | 'GENDERLESS';

// Combined type for a Pokemon with its species info
export interface PokemonWithSpecies extends Pokemon {
  pokemonSpecies: Pick<
    PokemonSpecies,
    'genderRate' | 'isBaby' | 'isLegendary' | 'isMythical' | 'captureRate'
  >;
}

// Values for a spawned Pokemon instance
export interface PokemonInstanceValues {
  level: number;
  shiny: boolean;
  gender: PokemonGender;
}

@Injectable()
export class PokemonSpawnService implements OnModuleInit {
  private readonly logger = new Logger(PokemonSpawnService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => TwitchService))
    private twitchService: TwitchService,
  ) {}

  async onModuleInit() {
    this.logger.log('PokemonCatchService initialized');
  }

  async spawnRandomPokemon() {
    const pokemon = await this.getRandomPokemon();
    if (!pokemon) {
      this.logger.warn('No Pokémon found to spawn');
      return;
    }

    const pokemonInstanceValues =
      PokemonRandomizer.getRandomPokemonValues(pokemon);

    await this.invalidateActiveSpawnEvents();

    await this.prisma.spawnEvent.create({
      data: {
        channel: process.env.TWITCH_CHANNEL!,
        pokemonInstance: {
          create: {
            pokemon: { connect: { id: pokemon.id } },
            level: pokemonInstanceValues.level,
            shiny: pokemonInstanceValues.shiny,
            gender: pokemonInstanceValues.gender,
          },
        },
      },
    });

    const message = PokemonMessageFormatter.getSpawnMessage(
      pokemon,
      pokemonInstanceValues,
    );
    await this.twitchService.sendChatMessage(message);
  }

  async getRandomPokemon(): Promise<PokemonWithSpecies | undefined> {
    const randomId = Math.floor(Math.random() * 151) + 1; // Pokémon IDs range from 1 to 151
    const pokemon = await this.prisma.pokemon.findUnique({
      where: { id: randomId },
      include: {
        pokemonSpecies: {
          select: {
            genderRate: true,
            isBaby: true,
            isLegendary: true,
            isMythical: true,
            captureRate: true,
          },
        },
      },
    });
    if (!pokemon) {
      this.logger.warn(`Pokemon with ID ${randomId} not found`);
      return;
    }
    if (!pokemon.pokemonSpecies) {
      this.logger.warn(`PokemonSpecies for Pokemon ID ${randomId} not found`);
      return;
    }
    return pokemon as PokemonWithSpecies;
  }

  async invalidateActiveSpawnEvents() {
    const activeSpawnEvents = await this.prisma.spawnEvent.findMany({
      where: {
        expiresAt: null,
        channel: process.env.TWITCH_CHANNEL!,
      },
    });

    if (activeSpawnEvents.length > 0) {
      for (const activeSpawnEvent of activeSpawnEvents) {
        await this.prisma.spawnEvent.update({
          where: { id: activeSpawnEvent.id },
          data: { expiresAt: new Date() },
        });
      }
    }
  }
}
