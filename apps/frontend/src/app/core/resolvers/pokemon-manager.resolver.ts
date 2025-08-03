import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  Pokemon,
  PokemonInstance,
  PokemonSprite,
  SpawnEvent,
} from '@prisma/generated-client';

export type PokemonManagerApiResponse = PokemonInstanceWithSprites[];

export type PokemonInstanceWithSprites = PokemonInstance & {
  spawnEvent: SpawnEvent;
  pokemon: Pokemon & { pokemonSprites: PokemonSprite };
};

@Injectable({ providedIn: 'root' })
export class PokemonManagerResolver
  implements Resolve<PokemonManagerApiResponse>
{
  constructor(private http: HttpClient) {}

  resolve(): Observable<PokemonManagerApiResponse> {
    return this.http
      .get<PokemonManagerApiResponse>(
        `${environment.backendURL}/pokemon-instances`,
      )
      .pipe(
        map((instances) =>
          instances.filter((instance) => instance.spawnEvent != null),
        ),
      );
  }
}
