import { Routes } from '@angular/router';
import { LoginComponent } from './features';
import { AuthGuard, UnauthGuard } from './core';
import { UserResolver } from './core/resolvers/user.resolver';
import { PokedexComponent } from './features/pokedex/pokedex.component';
import { LoggedInLayoutComponent } from './shared/components/logged-in-layout/logged-in-layout.component';
import { PokedexResolver } from './core/resolvers/pokedex.resolver';
import { PokemonManagerComponent } from './features/pokemon-manager/pokemon-manager.component';
import { ActiveTeamManagerComponent } from './features/active-team-manager/active-team-manager.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [UnauthGuard],
      },
      {
        path: '',
        component: LoggedInLayoutComponent,
        canActivate: [AuthGuard],
        resolve: { user: UserResolver },
        children: [
          {
            path: 'pokedex',
            component: PokedexComponent,
            resolve: { pokemon: PokedexResolver },
          },
          {
            path: 'pokemon',
            component: PokemonManagerComponent,
          },
          {
            path: 'active-team',
            component: ActiveTeamManagerComponent,
          },
          { path: '**', redirectTo: 'pokedex', pathMatch: 'full' },
        ],
      },
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];
