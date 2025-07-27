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
    this.logger.log('PokemonCatchService initialized');
  }

  async spawnRandomPokemon() {
    const pokemon = await this.getRandomPokemon();
    if (!pokemon) {
      this.logger.warn('No Pokémon found to spawn');
      return;
    }

    const pokemonInstanceValues = this.getRandomPokemonValues(pokemon);

    await this.invalidateActiveSpawnEvents();

    await this.prisma.spawnEvent.create({
      data: {
        channel: process.env.TWITCH_CHANNEL!,
        pokemonInstance: {
          create: {
            pokemon: { connect: { id: pokemon.id } },
            level: pokemonInstanceValues.level,
            shiny: pokemonInstanceValues.shiny, // 1 in 255 chance for shiny
            gender: pokemonInstanceValues.gender,
          },
        },
      },
    });

    let rarityString: string = 'wildes';
    if (pokemon.pokemonSpecies.isLegendary) {
      rarityString = '⭐legendäres⭐';
    } else if (pokemon.pokemonSpecies.isMythical) {
      rarityString = '🌟mythisches🌟';
    }

    let message = `Ein ${rarityString} ${pokemon.displayNameDe}${this.getGenderSymbol(pokemonInstanceValues.gender)} Level ${pokemonInstanceValues.level} ${pokemonInstanceValues.shiny ? '✨Shiny✨ ' : ''}erscheint!`;

    await this.twitchService.sendChatMessage(message);
  }

  async getRandomPokemon() {
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
    return pokemon;
  }

  getRandomPokemonValues(
    pokemon: {
      pokemonSpecies: {
        genderRate: number;
        isBaby: boolean;
        isLegendary: boolean;
        isMythical: boolean;
        captureRate: number;
      };
    } & {
      id: number;
      name: string;
      displayName: string;
      displayNameDe: string;
      type1: string;
      type2: string | null;
      pokemonSpeciesId: number;
    },
  ): {
    level: number;
    shiny: boolean;
    gender: 'MALE' | 'FEMALE' | 'GENDERLESS';
  } {
    const level = Math.floor(Math.random() * 100) + 1; // Random level between 1 and 100
    const shiny = Math.floor(Math.random() * 255) + 1 === 1; // Random level between 1 and 255

    const genderRate = pokemon.pokemonSpecies.genderRate;
    let gender: 'MALE' | 'FEMALE' | 'GENDERLESS';
    if (genderRate === -1) {
      gender = 'GENDERLESS';
    } else if (genderRate === 0) {
      gender = 'MALE';
    } else if (genderRate === 8) {
      gender = 'FEMALE';
    } else {
      // 1-7: female chance = genderRate/8
      const roll = Math.floor(Math.random() * 8); // 0-7
      gender = roll < genderRate ? 'FEMALE' : 'MALE';
    }
    return { level, shiny, gender };
  }

  getGenderSymbol(gender: 'MALE' | 'FEMALE' | 'GENDERLESS') {
    if (gender === 'MALE') {
      return '♂️';
    } else if (gender === 'FEMALE') {
      return '♀️';
    } else {
      return '⚧️'; // Genderless
    }
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
