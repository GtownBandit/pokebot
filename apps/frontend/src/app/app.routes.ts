import { Routes } from '@angular/router';
import { AuthTestComponent, LoginComponent } from './features';
import { AuthGuard, UnauthGuard } from './core';
import { UserResolver } from './core/resolvers/user.resolver';
import { PokedexComponent } from './features/pokedex/pokedex.component';
import { LoggedInLayoutComponent } from './shared/components/logged-in-layout/logged-in-layout.component';
import { PokedexResolver } from './core/resolvers/pokedex.resolver';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UnauthGuard],
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: LoggedInLayoutComponent,
    resolve: { user: UserResolver },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'auth-test', component: AuthTestComponent },
      {
        path: 'dashboard',
        component: PokedexComponent,
        resolve: { pokemon: PokedexResolver },
      },
    ],
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
