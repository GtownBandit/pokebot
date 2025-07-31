import { Routes } from '@angular/router';
import { AuthTestComponent, LoginComponent } from './features';
import { AuthGuard, UnauthGuard } from './core';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UnauthGuard],
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AuthTestComponent },
    ],
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
