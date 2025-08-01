// apps/backend/prisma/seed.ts
import { PrismaClient } from './generated/client';
import { GameClient, PokemonClient } from 'pokenode-ts';

const prisma = new PrismaClient();

async function main() {
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
    await prisma.pokemonSpecies.create({ data: pokemonSpeciesData });

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
    await prisma.pokemon.create({ data: pokemonData });

    // 3. Create Sprite
    if (
      !pokemon.sprites.other ||
      !pokemon.sprites.other['showdown'] ||
      pokemon.sprites.other['showdown'].front_default === null ||
      pokemon.sprites.other['showdown'].front_shiny === null ||
      pokemon.sprites.other['showdown'].back_default === null ||
      pokemon.sprites.other['showdown'].back_shiny === null
    ) {
      throw new Error('Missing sprite data for Pokémon: ' + pokemon.name);
    }
    const pokemonSpriteData = {
      pokemonId: pokemon.id,
      frontDefault: pokemon.sprites.other['showdown'].front_default,
      frontShiny: pokemon.sprites.other['showdown'].front_shiny,
      backDefault: pokemon.sprites.other['showdown'].back_default,
      backShiny: pokemon.sprites.other['showdown'].back_shiny,
      frontFemale: pokemon.sprites.other['showdown'].front_female,
      frontShinyFemale: pokemon.sprites.other['showdown'].front_shiny_female,
      backFemale: pokemon.sprites.other['showdown'].back_female,
      backShinyFemale: pokemon.sprites.other['showdown'].back_shiny_female,
    };
    await prisma.pokemonSprite.create({ data: pokemonSpriteData });

    // 4. Update species to set defaultPokemonId
    await prisma.pokemonSpecies.update({
      where: { id: pokemonSpecies.id },
      data: { defaultPokemonId },
    });

    console.log('Inserted Pokémon:', pokemonData.name);
  }
}

async function test() {
  const axios = require('axios');
  const sizeOf = require('image-size').default || require('image-size');
  const pLimit = require('p-limit').default || require("'p-limit");
  const pokemonClient = new PokemonClient();
  const gameClient = new GameClient();

  const pokemonList = await pokemonClient.listPokemons(0, 1302);
  const pokemonArray = pokemonList.results;

  let largestHeight = {
    height: 0,
    pokemon: '',
    spriteType: '',
    url: '',
  };
  let largestWidth = {
    width: 0,
    pokemon: '',
    spriteType: '',
    url: '',
  };
  let missingSprites: string[] = [];

  // Limit concurrency for API/image requests
  const limit = pLimit(10); // 10 concurrent requests

  // Fetch all Pokémon details in parallel
  const pokemonDetails = await Promise.all(
    pokemonArray.map((p) =>
      limit(() => pokemonClient.getPokemonByName(p.name)),
    ),
  );

  // Process each Pokémon in parallel
  await Promise.all(
    pokemonDetails.map(async (pokemon, i) => {
      const sprites = pokemon.sprites.other?.['showdown'];
      if (pokemon.name.includes('mega') || pokemon.name.includes('gmax')) {
        console.log('Skipping mega or gmax Pokémon:', pokemon.name);
        return;
      }
      if (
        !sprites ||
        sprites.front_default === null ||
        sprites.front_shiny === null ||
        sprites.back_default === null ||
        sprites.back_shiny === null
      ) {
        console.log(
          'Skipping Pokémon due to missing sprites:',
          i + 1,
          pokemon.name,
        );
        missingSprites.push(pokemon.name);
        return;
      }
      const spriteTypes = ['front_default', 'back_default'];
      console.log(
        `Checking Pokémon: ${pokemon.name} (${i + 1}/${pokemonArray.length})`,
      );
      await Promise.all(
        spriteTypes.map(async (type) => {
          const url = sprites[type];
          if (url) {
            try {
              const response = await limit(() =>
                axios.get(url, { responseType: 'arraybuffer' }),
              );
              const dimensions = sizeOf(response.data);
              // Use a lock to update largestHeight/largestWidth safely
              if (dimensions.height > largestHeight.height) {
                largestHeight = {
                  height: dimensions.height,
                  pokemon: pokemon.name,
                  spriteType: type,
                  url,
                };
              }
              if (dimensions.width > largestWidth.width) {
                largestWidth = {
                  width: dimensions.width,
                  pokemon: pokemon.name,
                  spriteType: type,
                  url,
                };
              }
            } catch (err) {
              console.error(
                'Error fetching sprite for',
                pokemon.name,
                type,
                url,
                err,
              );
            }
          }
        }),
      );
    }),
  );

  console.log('Missing sprites:', missingSprites.length);
  console.log(missingSprites);
  console.log(
    'Largest height:',
    largestHeight.height,
    'by',
    largestHeight.pokemon,
    largestHeight.spriteType,
    largestHeight.url,
  );
  console.log(
    'Largest width:',
    largestWidth.width,
    'by',
    largestWidth.pokemon,
    largestWidth.spriteType,
    largestWidth.url,
  );
}

// test().catch((e) => console.error(e));

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
