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

    const pokemonSpeciesData = {
      id: pokemonSpecies.id,
      genderRate: pokemonSpecies.gender_rate,
      isBaby: pokemonSpecies.is_baby,
      isLegendary: pokemonSpecies.is_legendary,
      isMythical: pokemonSpecies.is_mythical,
      captureRate: pokemonSpecies.capture_rate,
    };

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

    // await prisma.pokemonSpecies.create({ data: pokemonSpeciesData });
    // await prisma.pokemon.create({ data: pokemonData });
    await prisma.pokemonSprite.create({ data: pokemonSpriteData });
    console.log('Inserted Pokémon:', pokemonData.name);
  }
}

async function test() {
  const pokemonClient = new PokemonClient();
  const gameClient = new GameClient();

  const generation = await gameClient.getGenerationById(1);
  const pokemonSpeciesArray = generation.pokemon_species;
  for (let i = 0; i < pokemonSpeciesArray.length; i++) {
    let pokemon = await pokemonClient.getPokemonByName(
      pokemonSpeciesArray[i].name,
    );
    if (
      !pokemon.sprites.other ||
      !pokemon.sprites.other['showdown'] ||
      pokemon.sprites.other?.['showdown'].front_default === null ||
      pokemon.sprites.other?.['showdown'].front_shiny === null ||
      pokemon.sprites.other?.['showdown'].back_default === null ||
      pokemon.sprites.other?.['showdown'].back_shiny === null
    ) {
      throw new Error('Missing sprite data for Pokémon: ' + pokemon.name);
    } else {
      console.log('Sprite data is complete for Pokémon:', pokemon.name);
    }
  }
}

// test().catch((e) => console.error(e));

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
