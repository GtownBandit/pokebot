// apps/backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { GameClient, PokemonClient } from 'pokenode-ts';

const prisma = new PrismaClient();

async function main() {
  const pokemonClient = new PokemonClient();
  const gameClient = new GameClient();
  const generation = await gameClient.getGenerationById(1);
  const pokemonSpeciesArray = generation.pokemon_species;
  for (let i = 0; i < pokemonSpeciesArray.length; i++) {
    let pokemon = await pokemonClient.getPokemonByName(
      pokemonSpeciesArray[i].name,
    );
    let pokemonSpecies = await pokemonClient.getPokemonSpeciesByName(
      pokemonSpeciesArray[i].name,
    );

    const data = {
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
    };

    await prisma.pokemon.create({ data });
    console.log('Inserted Pokémon:', data.name);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
