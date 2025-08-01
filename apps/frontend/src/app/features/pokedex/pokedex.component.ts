import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokedexEntry } from '../../core/resolvers/pokedex.resolver';

@Component({
  selector: 'app-pokedex',
  imports: [],
  templateUrl: './pokedex.component.html',
  styleUrl: './pokedex.component.scss',
})
export class PokedexComponent {
  pokedexEntries: PokedexEntry[];

  constructor(private route: ActivatedRoute) {
    this.pokedexEntries = this.route.snapshot.data['pokemon'].sort(
      (a: PokedexEntry, b: PokedexEntry) => a.id - b.id,
    );
  }

  getDefaultPokemonSprite(id: PokedexEntry['id']) {
    const pokemon = this.pokedexEntries.find((p) => p.id === id);
    if (pokemon && pokemon.defaultPokemon) {
      return pokemon.defaultPokemon.pokemonSprites.frontShiny;
    }
    return null;
  }
}
