import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-pokemon-type-label',
  imports: [NgClass],
  templateUrl: './pokemon-type-label.component.html',
  styleUrl: './pokemon-type-label.component.scss',
})
export class PokemonTypeLabelComponent {
  @Input({ required: true }) pokemonType!: string;
  @Input() hideType = false;

  get typeName(): string {
    if (this.hideType) {
      return '???'; // Default text when type is hidden
    }
    return this.pokemonType;
  }

  get backgroundTypeClass(): string {
    if (this.hideType) {
      return 'bg-neutral-400'; // Default background when type is hidden
    }
    switch (this.pokemonType) {
      case 'normal':
        return 'bg-type-normal';
      case 'fire':
        return 'bg-type-fire';
      case 'water':
        return 'bg-type-water';
      case 'grass':
        return 'bg-type-grass';
      case 'electric':
        return 'bg-type-electric';
      case 'ice':
        return 'bg-type-ice';
      case 'fighting':
        return 'bg-type-fighting';
      case 'poison':
        return 'bg-type-poison';
      case 'ground':
        return 'bg-type-ground';
      case 'flying':
        return 'bg-type-flying';
      case 'psychic':
        return 'bg-type-psychic';
      case 'bug':
        return 'bg-type-bug';
      case 'rock':
        return 'bg-type-rock';
      case 'ghost':
        return 'bg-type-ghost';
      case 'dragon':
        return 'bg-type-dragon';
      case 'dark':
        return 'bg-type-dark';
      case 'steel':
        return 'bg-type-steel';
      case 'fairy':
        return 'bg-type-fairy';
      default:
        return 'bg-neutral-400'; // Default background for unknown types
    }
  }
}
