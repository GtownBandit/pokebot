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
          username: message.userInfo.userName,
        },
      });
    } else if (user.username !== message.userInfo.userName) {
      // Update username if it has changed
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { username: message.userInfo.userName },
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
            pokemon: true,
          },
        },
      },
      orderBy: { expiresAt: 'desc' },
    });

    if (!spawnEvent) {
      await this.twitchService.sendChatMessage(
        'Es gibt kein aktives Pokémon zum Fangen!',
      );
      return;
    }

    const roll = Math.floor(Math.random() * 100) + 1;
    const level = spawnEvent.pokemonInstance.level;
    const pokemonName = spawnEvent.pokemonInstance.pokemon.displayNameDe;
    const escapeRoll = Math.floor(Math.random() * 5) + 1;
    // Create catch roll event with userId
    await this.prisma.catchRollEvent.create({
      data: {
        userId: user.id,
        roll,
        spawnEventId: spawnEvent.id,
        success: roll >= level,
        pokemonRanAway: escapeRoll <= 1,
      },
    });

    if (roll >= level) {
      // Mark as caught (customize as needed)
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
        `${user.username} hat ${pokemonName} gefangen! (Wurf: ${roll} / Level: ${level})`,
      );
    } else {
      if (escapeRoll <= 1) {
        await this.prisma.spawnEvent.update({
          where: { id: spawnEvent.id },
          data: { expiresAt: new Date() },
        });
        await this.twitchService.sendChatMessage(
          `${pokemonName} ist entkommen! (Wurf: ${roll} / Level: ${level})`,
        );
      } else {
        await this.twitchService.sendChatMessage(
          `${user.username} verfehlt das ${pokemonName}... (Wurf: ${roll} / Level: ${level})`,
        );
      }
    }
  }
}
