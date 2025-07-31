import { Routes } from '@angular/router';
import { AuthTestComponent, LoginComponent } from './features';
import { AuthGuard, UnauthGuard } from './core';
import { UserResolver } from './core/resolvers/user.resolver';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UnauthGuard],
  },
  {
    path: '',
    canActivate: [AuthGuard],
    resolve: { user: UserResolver },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AuthTestComponent },
    ],
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
