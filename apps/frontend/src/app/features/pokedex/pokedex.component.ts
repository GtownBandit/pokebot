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
  totalSpeciesCaught: number = 0;
  totalPokemon: number = 0;
  totalPokemonCaught: number = 0;
  percentageCaught: number = 0;

  constructor(private route: ActivatedRoute) {
    this.pokedexEntries = this.route.snapshot.data['pokemon'].sort(
      (a: PokedexEntry, b: PokedexEntry) => a.id - b.id,
    );
    this.totalPokemon = this.pokedexEntries.length;
    this.totalSpeciesCaught = this.pokedexEntries.filter(
      (e) => e.caughtPokemon.length > 0,
    ).length;
    this.totalPokemonCaught = this.pokedexEntries.reduce(
      (acc, entry) => acc + entry.caughtPokemon.length,
      0,
    );
    this.percentageCaught =
      this.totalPokemon > 0
        ? Math.floor((this.totalSpeciesCaught / this.totalPokemon) * 1000) / 10
        : 0;
  }
}
