import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  Pokemon,
  PokemonSpecies,
  PokemonSprite,
} from '@prisma/generated-client';

export type PokedexEntry = PokemonSpecies & {
  defaultPokemon: Pokemon & { pokemonSprites: PokemonSprite };
  caughtPokemon: Pokemon[];
  hasAtLeastOneShiny: boolean;
};

export type PokedexEntryApiResponse = PokedexEntry[];

@Injectable({ providedIn: 'root' })
export class PokedexResolver implements Resolve<PokedexEntryApiResponse> {
  constructor(private http: HttpClient) {}

  resolve(): Observable<PokedexEntryApiResponse> {
    return this.http.get<PokedexEntryApiResponse>(
      `${environment.backendURL}/pokedex`,
    );
  }
}
