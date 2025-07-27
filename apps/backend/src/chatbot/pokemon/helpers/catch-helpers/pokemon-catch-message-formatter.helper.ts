import { CatchRollResult } from '../../pokemon-catch.service';

export class PokemonCatchMessageFormatter {
  static getCatchSuccessMessage(
    username: string,
    pokemonName: string,
    result: CatchRollResult,
  ): string {
    return `${username} hat ${pokemonName} gefangen! (Wurf: ${result.roll} / Level: ${result.level})`;
  }

  static getCatchFailMessage(
    username: string,
    pokemonName: string,
    result: CatchRollResult,
  ): string {
    return `${username} verfehlt das ${pokemonName}... (Wurf: ${result.roll} / Level: ${result.level})`;
  }

  static getEscapeMessage(
    pokemonName: string,
    result: CatchRollResult,
  ): string {
    return `${pokemonName} ist entkommen! (Wurf: ${result.roll} / Level: ${result.level})`;
  }

  static getNoActivePokemonMessage(): string {
    return 'Es gibt kein aktives Pokémon zum Fangen!';
  }
}
