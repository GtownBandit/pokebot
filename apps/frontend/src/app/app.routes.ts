import { Routes } from '@angular/router';
import { AuthTestComponent, LoginComponent } from './features';
import { AuthResolver } from './core';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    resolve: { auth: AuthResolver },
  },
  {
    path: 'auth-test',
    component: AuthTestComponent,
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
