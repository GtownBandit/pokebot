import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pokemon } from '../../../prisma-types';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-pokedex',
  imports: [JsonPipe],
  templateUrl: './pokedex.component.html',
  styleUrl: './pokedex.component.scss',
})
export class PokedexComponent {
  pokedexPokemon: Pokemon[];

  constructor(private route: ActivatedRoute) {
    this.pokedexPokemon = this.route.snapshot.data['pokemon'].sort(
      (a: Pokemon, b: Pokemon) => a.id - b.id,
    );
  }
}
