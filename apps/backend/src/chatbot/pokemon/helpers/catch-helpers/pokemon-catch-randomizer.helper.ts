import {
  CatchRollResult,
  SpawnEventWithInstanceAndSpecies,
} from '../../pokemon-catch.service';

export class PokemonCatchRandomizer {
  static getCatchRoll(
    spawnEvent: SpawnEventWithInstanceAndSpecies,
  ): CatchRollResult {
    const roll = Math.floor(Math.random() * 100) + 1;
    const level = spawnEvent.pokemonInstance.level;
    const captureRate =
      spawnEvent.pokemonInstance.pokemon.pokemonSpecies.captureRate;
    const escapeChance = (1 - captureRate / 255) * (1 / 3);
    const escaped = Math.random() < escapeChance;
    const success = roll >= level;
    return { roll, level, captureRate, escaped, success };
  }
}
