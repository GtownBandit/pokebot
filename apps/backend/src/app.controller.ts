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
import { GameClient, PokemonClient } from 'pokenode-ts';

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

  @Get('seed-db')
  async seedDb(): Promise<any> {
    try {
      await this.insertOne();
      await this.insertTwo();
      return { message: 'Database seeding completed successfully.' };
    } catch (error) {
      console.error('Error during database seeding:', error);
      throw new HttpException(
        'Database seeding failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async insertOne() {
    const pokemonClient = new PokemonClient();
    const gameClient = new GameClient();
    const generation = await gameClient.getGenerationById(1);
    const pokemonSpeciesArray = generation.pokemon_species;

    // Add all Pokémon from Generation 1 to the database
    console.log('Inserting Pokémon from Generation 1...');
    for (let i = 0; i < pokemonSpeciesArray.length; i++) {
      let pokemon = await pokemonClient.getPokemonByName(
        pokemonSpeciesArray[i].name,
      );
      let pokemonSpecies = await pokemonClient.getPokemonSpeciesByName(
        pokemonSpeciesArray[i].name,
      );

      let defaultPokemonVariety = pokemonSpecies.varieties.find((pokemon) => {
        return pokemon.is_default;
      });
      if (!defaultPokemonVariety) {
        throw new Error(
          `No default variety found for Pokémon: ${pokemonSpecies.name}`,
        );
      }
      const defaultPokemonId = parseInt(
        defaultPokemonVariety.pokemon.url.split('/')[6],
      );

      // 1. Create species without defaultPokemonId
      const pokemonSpeciesData = {
        id: pokemonSpecies.id,
        genderRate: pokemonSpecies.gender_rate,
        isBaby: pokemonSpecies.is_baby,
        isLegendary: pokemonSpecies.is_legendary,
        isMythical: pokemonSpecies.is_mythical,
        captureRate: pokemonSpecies.capture_rate,
        // defaultPokemonId will be set later
      };
      await this.prisma.pokemonSpecies.create({ data: pokemonSpeciesData });

      // 2. Create Pokemon
      const pokemonData = {
        id: pokemon.id,
        name: pokemon.name,
        displayName:
          pokemonSpecies.names.find((name) => name.language.name === 'en')
            ?.name || '',
        displayNameDe:
          pokemonSpecies.names.find((name) => name.language.name === 'de')
            ?.name || '',
        type1: pokemon.types[0].type.name,
        type2: pokemon.types[1]?.type.name || null,
        pokemonSpeciesId: pokemonSpecies.id,
      };
      await this.prisma.pokemon.create({ data: pokemonData });

      // 3. Create Sprite
      const showdown = (pokemon.sprites.other as any)['showdown'];
      if (
        !showdown ||
        showdown.front_default === null ||
        showdown.front_shiny === null ||
        showdown.back_default === null ||
        showdown.back_shiny === null ||
        pokemon.sprites.versions['generation-viii'].icons.front_default === null
      ) {
        throw new Error('Missing sprite data for Pokémon: ' + pokemon.name);
      }
      const pokemonSpriteData = {
        pokemonId: pokemon.id,
        frontDefault: showdown.front_default,
        frontShiny: showdown.front_shiny,
        backDefault: showdown.back_default,
        backShiny: showdown.back_shiny,
        frontFemale: showdown.front_female,
        frontShinyFemale: showdown.front_shiny_female,
        backFemale: showdown.back_female,
        backShinyFemale: showdown.back_shiny_female,
        spriteDefault:
          pokemon.sprites.versions['generation-viii'].icons.front_default,
        spriteFemale:
          pokemon.sprites.versions['generation-viii'].icons.front_female,
      };
      await this.prisma.pokemonSprite.create({ data: pokemonSpriteData });

      // 4. Update species to set defaultPokemonId
      await this.prisma.pokemonSpecies.update({
        where: { id: pokemonSpecies.id },
        data: { defaultPokemonId },
      });

      console.log('Inserted Pokémon:', pokemonData.name);
    }
  }

  async insertTwo() {
    const pokemonClient = new PokemonClient();
    const gameClient = new GameClient();
    const generation = await gameClient.getGenerationById(1);
    const pokemonSpeciesArray = generation.pokemon_species;
    for (let i = 0; i < pokemonSpeciesArray.length; i++) {
      let pokemon = await pokemonClient.getPokemonByName(
        pokemonSpeciesArray[i].name,
      );

      if (!pokemon.sprites.versions['generation-viii'].icons.front_default) {
        throw new Error('Missing sprite for Pokémon: ' + pokemon.name);
      }
      await this.prisma.pokemonSprite.update({
        where: { pokemonId: pokemon.id },
        data: {
          spriteDefault:
            pokemon.sprites.versions['generation-viii'].icons.front_default,
          spriteFemale:
            pokemon.sprites.versions['generation-viii'].icons.front_female,
        },
      });
      console.log('Updated sprite for Pokémon:', pokemon.name);
    }
  }
}
