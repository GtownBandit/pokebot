import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonInstanceWithSprites } from '../../core/resolvers/pokemon-manager.resolver';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-pokemon-manager',
  imports: [NgOptimizedImage],
  templateUrl: './pokemon-manager.component.html',
  styleUrl: './pokemon-manager.component.scss',
})
export class PokemonManagerComponent {
  pokemonInstancesWithSprites: PokemonInstanceWithSprites[] = [];

  constructor(private route: ActivatedRoute) {
    // This component is currently empty, but you can add functionality here
    // to manage Pokemon instances, such as displaying a list of Pokemon,
    // allowing users to catch or release Pokemon, etc.
    this.pokemonInstancesWithSprites = this.route.snapshot.data[
      'pokemonInstances'
    ].sort(
      (a: PokemonInstanceWithSprites, b: PokemonInstanceWithSprites) =>
        a.pokemon.id - b.pokemon.id,
    );
  }
}
