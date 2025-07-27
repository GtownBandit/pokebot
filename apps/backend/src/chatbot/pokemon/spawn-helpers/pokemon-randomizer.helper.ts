import {
  PokemonGender,
  PokemonInstanceValues,
  PokemonWithSpecies,
} from '../pokemon-spawn.service';

export class PokemonRandomizer {
  static getRandomPokemonValues(
    pokemon: PokemonWithSpecies,
  ): PokemonInstanceValues {
    const level = Math.floor(Math.random() * 100) + 1; // Random level between 1 and 100
    const shiny = Math.floor(Math.random() * 255) + 1 === 1; // 1 in 255 chance for shiny

    const genderRate = pokemon.pokemonSpecies.genderRate;
    let gender: PokemonGender;
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
}
