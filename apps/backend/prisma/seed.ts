// apps/backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

interface NamedAPIResource {
  name: string;
  url: string;
}

interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}

interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource;
}

interface PokemonStat {
  stat: NamedAPIResource;
  effort: number;
  base_stat: number;
}

interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  front_female: string | null;
  front_shiny_female: string | null;
  back_default: string | null;
  back_shiny: string | null;
  back_female: string | null;
  back_shiny_female: string | null;
  versions: any; // can be typed more specifically if needed
}

interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;
  abilities: PokemonAbility[];
  forms: NamedAPIResource[];
  game_indices: any[]; // can be typed more specifically if needed
  held_items: any[]; // can be typed more specifically if needed
  location_area_encounters: string;
  moves: any[]; // can be typed more specifically if needed
  past_types: any[]; // can be typed more specifically if needed
  sprites: PokemonSprites;
  cries: { latest: string; legacy: string };
  species: NamedAPIResource;
  stats: PokemonStat[];
  types: PokemonType[];
}

const prisma = new PrismaClient();

async function main() {
  for (let id = 1; id <= 151; id++) {
    // first-gen Pokémon for now
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = (await res.json()) as Pokemon;

    await prisma.pokemonSpecies.create({
      data: {
        id: data.id,
        name: data.name,
        displayName: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        type1: data.types[0]?.type?.name,
        type2: data.types[1]?.type?.name,
        baseStats: {
          hp: data.stats[0].base_stat,
          attack: data.stats[1].base_stat,
          defense: data.stats[2].base_stat,
          spAttack: data.stats[3].base_stat,
          spDefense: data.stats[4].base_stat,
          speed: data.stats[5].base_stat,
        },
        baseExp: data.base_experience,
        captureRate: 45, // default or from species API
        spriteUrl:
          data.sprites.versions['generation-v']['black-white'].animated
            .front_default,
        shinyUrl:
          data.sprites.versions['generation-v']['black-white'].animated
            .front_shiny,
        rarity: Math.floor(Math.random() * 100) + 1, // placeholder rarity
      },
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
