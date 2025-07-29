import { Routes } from '@angular/router';
import { AuthTestComponent, LoginComponent } from './features';
import { AuthGuard, AuthResolver } from './core';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    resolve: { auth: AuthResolver },
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: AuthTestComponent,
      },
      // Add future protected routes here
    ],
  },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];
