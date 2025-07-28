import { Component, inject } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { LoginBackgroundComponent } from '../login-background/login-background.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [LoginBackgroundComponent],
})
export class LoginComponent {
  private auth = inject(Auth0Service);

  login() {
    this.auth.loginWithRedirect();
  }
}
