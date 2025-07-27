import {
  PokemonGender,
  PokemonInstanceValues,
  PokemonWithSpecies,
} from '../pokemon-spawn.service';

export class PokemonMessageFormatter {
  static getGenderSymbol(gender: PokemonGender): string {
    if (gender === 'MALE') return '♂️';
    if (gender === 'FEMALE') return '♀️';
    return '⚧️';
  }

  static getRarityString(pokemon: PokemonWithSpecies): string {
    if (pokemon.pokemonSpecies.isLegendary) return '⭐legendäres⭐';
    if (pokemon.pokemonSpecies.isMythical) return '🌟mythisches🌟';
    return 'wildes';
  }

  static getSpawnMessage(
    pokemon: PokemonWithSpecies,
    values: PokemonInstanceValues,
  ): string {
    const rarity = this.getRarityString(pokemon);
    const genderSymbol = this.getGenderSymbol(values.gender);
    const shiny = values.shiny ? '✨Shiny✨ ' : '';
    return `Ein ${rarity} ${pokemon.displayNameDe}${genderSymbol} Level ${values.level} ${shiny}erscheint!`;
  }
}
