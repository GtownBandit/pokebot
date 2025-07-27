import { Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { AuthTestComponent } from './auth-test/auth-test.component';
import { AuthResolver } from './auth.resolver';

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
