import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PrismaService } from './prisma/prisma.service';
import {
  CatchRollEvent,
  Pokemon,
  PokemonInstance,
  PokemonSpecies,
  PokemonSprite,
  SpawnEvent,
} from '@prisma/generated-client';

export type PokedexEntry = PokemonSpecies & {
  defaultPokemon: (Pokemon & { pokemonSprites: PokemonSprite | null }) | null;
};

export type PokedexResponse = (PokedexEntry & {
  caughtPokemon: Pokemon[];
  hasAtLeastOneShiny: boolean;
})[];

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Get('pokedex')
  async getPokedexData(@Req() req): Promise<PokedexResponse> {
    const twitchId = req.user.userId;

    // Get all pokemon instances for the user
    const userInstances: (PokemonInstance & { pokemon: Pokemon })[] =
      await this.prisma.pokemonInstance.findMany({
        where: { user: { twitchId } },
        include: { pokemon: true },
      });

    // Group user's caught pokemon by speciesId
    const caughtMap = new Map<number, Pokemon[]>();
    userInstances.forEach((instance) => {
      const speciesId = instance.pokemon.pokemonSpeciesId;
      if (!caughtMap.has(speciesId)) {
        caughtMap.set(speciesId, []);
      }
      caughtMap.get(speciesId)!.push(instance.pokemon);
    });

    // Get all pokedex entries
    const pokedexEntries: PokedexEntry[] =
      await this.prisma.pokemonSpecies.findMany({
        include: {
          defaultPokemon: {
            include: {
              pokemonSprites: true,
            },
          },
        },
      });

    // Add caughtPokemon array and shiny flag to each entry
    return pokedexEntries.map((entry) => {
      // Get all instances for this species
      const instances = userInstances.filter(
        (instance) => instance.pokemon.pokemonSpeciesId === entry.id,
      );
      const caughtPokemon = instances.map((instance) => instance.pokemon);
      const hasAtLeastOneShiny = instances.some((instance) => instance.shiny);
      return {
        ...entry,
        caughtPokemon,
        hasAtLeastOneShiny,
      };
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('pokemon-instances')
  async getPokemonInstances(@Req() req): Promise<PokemonInstance[]> {
    const twitchId = req.user.userId;
    const userWithInstances = await this.prisma.user.findUnique({
      where: { twitchId: twitchId },
      include: {
        pokemonInstances: {
          include: {
            spawnEvent: true,
            pokemon: {
              include: {
                pokemonSprites: true,
              },
            },
          },
        },
      },
    });
    if (!userWithInstances) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return userWithInstances.pokemonInstances;
  }

  @UseGuards(JwtAuthGuard)
  @Get('catch-roll-events')
  async getCatchRolls(@Req() req): Promise<CatchRollEvent[]> {
    const twitchId = req.user.userId;
    const userWithEvents = await this.prisma.user.findUnique({
      where: { twitchId: twitchId },
      include: { catchRollEvents: true },
    });
    if (!userWithEvents) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return userWithEvents.catchRollEvents;
  }

  @UseGuards(JwtAuthGuard)
  @Get('spawn-events')
  async getSpawnEvents(): Promise<SpawnEvent[]> {
    return this.prisma.spawnEvent.findMany();
  }

  @UseGuards(JwtAuthGuard)
  @Post('user')
  async createUser(
    @Req() req,
    @Body() body: { twitchId: string; username: string },
    @Res() res,
  ): Promise<any> {
    const { twitchId, username } = body;
    const jwtTwitchId = req.user?.userId;
    if (!jwtTwitchId || twitchId !== jwtTwitchId) {
      throw new HttpException(
        'twitchId does not match authenticated user',
        HttpStatus.FORBIDDEN,
      );
    }
    if (!twitchId || !username) {
      throw new HttpException(
        'Missing twitchId or username',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Check if user exists
    let user = await this.prisma.user.findUnique({ where: { twitchId } });

    if (user) {
      // If username has changed, update it if not taken
      if (user.username !== username) {
        const usernameExists = await this.prisma.user.findUnique({
          where: { username },
        });
        if (usernameExists) {
          throw new HttpException(
            'Username already taken',
            HttpStatus.CONFLICT,
          );
        }
        user = await this.prisma.user.update({
          where: { twitchId },
          data: { username },
        });
      }
      return res.status(200).json(user);
    }
    // Check for username conflict
    const usernameExists = await this.prisma.user.findUnique({
      where: { username },
    });
    if (usernameExists) {
      throw new HttpException('Username already taken', HttpStatus.CONFLICT);
    }
    // Create user
    try {
      user = await this.prisma.user.create({ data: { twitchId, username } });
      return res.status(201).json(user);
    } catch (e) {
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
