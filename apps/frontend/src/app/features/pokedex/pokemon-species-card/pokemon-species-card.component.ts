import { Component, Input } from '@angular/core';
import { PokedexEntry } from '../../../core/resolvers/pokedex.resolver';
import { PokemonTypeLabelComponent } from '../../../shared/components/pokemon-type-label/pokemon-type-label.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-pokemon-species-card',
  imports: [PokemonTypeLabelComponent, NgClass],
  templateUrl: './pokemon-species-card.component.html',
  styleUrl: './pokemon-species-card.component.scss',
})
export class PokemonSpeciesCardComponent {
  @Input({ required: true }) pokedexEntry!: PokedexEntry;

  get isCaught() {
    return this.pokedexEntry.caughtPokemon.length > 0;
  }

  get pokedexNumber(): string {
    return '#' + this.pokedexEntry.id.toString().padStart(3, '0');
  }
  get pokemonName(): string {
    return this.isCaught
      ? this.pokedexEntry.defaultPokemon.displayNameDe
      : '?'.repeat(this.pokedexEntry.defaultPokemon.displayNameDe.length);
  }
  get defaultType1(): string {
    return this.pokedexEntry.defaultPokemon.type1;
  }
  get defaultType2(): string | null {
    return this.pokedexEntry.defaultPokemon.type2 ?? null;
  }

  get defaultPokemonSprite(): string | null {
    if (this.pokedexEntry && this.pokedexEntry.defaultPokemon) {
      if (this.pokedexEntry.hasAtLeastOneShiny) {
        return this.pokedexEntry.defaultPokemon.pokemonSprites.frontShiny;
      } else {
        return this.pokedexEntry.defaultPokemon.pokemonSprites.frontDefault;
      }
    }
    return null;
  }
}
