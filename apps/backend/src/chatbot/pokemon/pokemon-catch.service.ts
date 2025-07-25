// apps/backend/src/chatbot/pokemon/pokemon-catch.service.ts
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TwitchService } from '../twitch.service';

@Injectable()
export class PokemonCatchService {
  private readonly logger = new Logger(PokemonCatchService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => TwitchService))
    private twitchService: TwitchService,
  ) {}

  async tryCatchPokemon(username: string) {
    // Get the current active spawn event
    const spawnEvent = await this.prisma.spawnEvent.findFirst({
      where: {
        expiresAt: { gt: new Date() },
        caughtById: null, // Only consider uncaught Pokémon
        channel: process.env.TWITCH_CHANNEL!,
      },
      include: { pokemon: true },
      orderBy: { expiresAt: 'desc' },
    });

    if (!spawnEvent) {
      await this.twitchService.sendChatMessage(
        'Es gibt kein aktives Pokémon zum Fangen!',
      );
      return;
    }

    const roll = Math.floor(Math.random() * 100) + 1;
    const level = spawnEvent.level;
    const pokemonName = spawnEvent.pokemon.displayNameDe;
    // Find or create user by username
    let user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) {
      user = await this.prisma.user.create({ data: { username } });
    }

    // Create catch roll event with userId
    await this.prisma.catchRollEvent.create({
      data: {
        userId: user.id,
        roll,
        spawnEventId: spawnEvent.id,
        success: roll >= level,
      },
    });

    if (roll >= level) {
      // Mark as caught (customize as needed)
      await this.prisma.spawnEvent.update({
        where: { id: spawnEvent.id },
        data: { caughtById: username },
      });
      await this.twitchService.sendChatMessage(
        `${username} hat ${pokemonName} gefangen! (Wurf: ${roll} / Level: ${level})`,
      );
    } else {
      const escapeRoll = Math.floor(Math.random() * 10) + 1;
      if (escapeRoll <= 1) {
        await this.prisma.spawnEvent.delete({
          where: { id: spawnEvent.id },
        });
        await this.twitchService.sendChatMessage(
          `${pokemonName} ist entkommen! (Wurf: ${roll} / Level: ${level})`,
        );
      } else {
        await this.twitchService.sendChatMessage(
          `${username} verfehlt das ${pokemonName}... (Wurf: ${roll} / Level: ${level})`,
        );
      }
    }
  }
}
