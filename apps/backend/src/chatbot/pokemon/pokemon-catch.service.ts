// apps/backend/src/chatbot/pokemon/pokemon-catch.service.ts
import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TwitchService } from '../twitch.service';
import { ChatMessage } from '@twurple/chat';
import {
  Pokemon,
  PokemonInstance,
  PokemonSpecies,
  SpawnEvent,
} from '@prisma/generated-client';
import { PokemonCatchRandomizer } from './helpers/catch-helpers/pokemon-catch-randomizer.helper';
import { PokemonCatchMessageFormatter } from './helpers/catch-helpers/pokemon-catch-message-formatter.helper';

// --- Types and Interfaces ---
export interface SpawnEventWithInstanceAndSpecies extends SpawnEvent {
  pokemonInstance: PokemonInstanceWithPokemonAndSpecies;
}

export interface PokemonInstanceWithPokemonAndSpecies extends PokemonInstance {
  pokemon: PokemonWithSpecies;
}

export interface PokemonWithSpecies extends Pokemon {
  pokemonSpecies: PokemonSpecies;
}

export interface CatchRollResult {
  roll: number;
  level: number;
  captureRate: number;
  escaped: boolean;
  success: boolean;
}

@Injectable()
export class PokemonCatchService implements OnModuleInit {
  private readonly logger = new Logger(PokemonCatchService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => TwitchService))
    private twitchService: TwitchService,
  ) {}

  async onModuleInit() {
    this.logger.log('PokemonSpawnService initialized');
  }

  async tryCatchPokemon(message: ChatMessage) {
    // Find or create user by username
    let user = await this.prisma.user.findUnique({
      where: { twitchId: message.userInfo.userId },
    });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          twitchId: message.userInfo.userId,
          username: message.userInfo.displayName,
        },
      });
    } else if (user.username !== message.userInfo.displayName) {
      // Update username if it has changed
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { username: message.userInfo.displayName },
      });
    }

    // Get the current active spawn event
    const spawnEvent = await this.prisma.spawnEvent.findFirst({
      where: {
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        channel: process.env.TWITCH_CHANNEL!,
      },
      include: {
        pokemonInstance: {
          include: {
            pokemon: {
              include: {
                pokemonSpecies: true, // Just 'true' to include all scalar fields
              },
            },
          },
        },
      },
      orderBy: { expiresAt: 'desc' },
    });

    if (!spawnEvent) {
      await this.twitchService.sendChatMessage(
        PokemonCatchMessageFormatter.getNoActivePokemonMessage(),
      );
      return;
    }

    const catchResult = PokemonCatchRandomizer.getCatchRoll(
      spawnEvent as SpawnEventWithInstanceAndSpecies,
    );
    const pokemonName = spawnEvent.pokemonInstance.pokemon.displayNameDe;

    await this.prisma.catchRollEvent.create({
      data: {
        userId: user.id,
        roll: catchResult.roll,
        spawnEventId: spawnEvent.id,
        success: catchResult.success,
        pokemonRanAway: catchResult.escaped,
      },
    });

    if (catchResult.success) {
      await this.prisma.spawnEvent.update({
        where: { id: spawnEvent.id },
        data: {
          expiresAt: new Date(),
          pokemonInstance: {
            update: {
              userId: user.id,
            },
          },
        },
      });
      await this.twitchService.sendChatMessage(
        PokemonCatchMessageFormatter.getCatchSuccessMessage(
          user.username,
          pokemonName,
          catchResult,
        ),
      );
    } else {
      if (catchResult.escaped) {
        await this.prisma.spawnEvent.update({
          where: { id: spawnEvent.id },
          data: { expiresAt: new Date() },
        });
        await this.twitchService.sendChatMessage(
          PokemonCatchMessageFormatter.getEscapeMessage(
            pokemonName,
            catchResult,
          ),
        );
      } else {
        await this.twitchService.sendChatMessage(
          PokemonCatchMessageFormatter.getCatchFailMessage(
            user.username,
            pokemonName,
            catchResult,
          ),
        );
      }
    }
  }
}
