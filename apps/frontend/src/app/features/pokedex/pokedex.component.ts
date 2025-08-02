import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokedexEntry } from '../../core/resolvers/pokedex.resolver';
import { PokemonSpeciesCardComponent } from './pokemon-species-card/pokemon-species-card.component';

@Component({
  selector: 'app-pokedex',
  imports: [PokemonSpeciesCardComponent],
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
    const pokedexEntry = this.pokedexEntries.find((p) => p.id === id);
    if (pokedexEntry && pokedexEntry.defaultPokemon) {
      if (pokedexEntry.hasAtLeastOneShiny) {
        return pokedexEntry.defaultPokemon.pokemonSprites.frontShiny;
      } else {
        return pokedexEntry.defaultPokemon.pokemonSprites.frontDefault;
      }
    }
    return null;
  }
}
