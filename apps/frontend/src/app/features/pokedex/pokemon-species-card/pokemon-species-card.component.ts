import { Component, Input } from '@angular/core';
import { PokedexEntry } from '../../../core/resolvers/pokedex.resolver';
import { PokemonTypeLabelComponent } from '../../../shared/components/pokemon-type-label/pokemon-type-label.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-species-card',
  imports: [PokemonTypeLabelComponent],
  templateUrl: './pokemon-species-card.component.html',
  styleUrl: './pokemon-species-card.component.scss',
})
export class PokemonSpeciesCardComponent {
  @Input({ required: true }) pokedexEntry!: PokedexEntry;

  constructor(private router: Router) {}

  get isCaught() {
    return this.pokedexEntry.caughtPokemon.length > 0;
  }

  get amountCaught(): number {
    return this.pokedexEntry.caughtPokemon.length;
  }

  get hasShiny(): boolean {
    return this.pokedexEntry.hasAtLeastOneShiny;
  }

  get pokedexNumber(): string {
    return '#' + this.pokedexEntry.id.toString().padStart(3, '0');
  }

  get pokemonName(): string {
    let name = this.isCaught
      ? this.pokedexEntry.defaultPokemon.displayNameDe
      : '?'.repeat(this.pokedexEntry.defaultPokemon.displayNameDe.length);
    if (this.hasShiny) {
      name = '✨' + name + '✨';
    }
    return name;
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

  get cardClass(): string {
    if (this.isCaught && this.hasShiny) {
      return 'hover:-translate-y-1 rainbow-bg cursor-pointer border-warning';
    }
    if (this.isCaught && !this.hasShiny) {
      return 'bg-base-100 hover:-translate-y-1 cursor-pointer';
    }
    return 'border-base-100';
  }

  onPokemonSpeciesClick() {
    if (this.isCaught) {
      this.router.navigateByUrl(
        `/pokemon?pokemonId=${this.pokedexEntry.caughtPokemon[0].id}`,
      );
    }
  }
}
