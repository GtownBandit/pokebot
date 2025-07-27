import { Component, inject } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private auth = inject(Auth0Service);

  login() {
    this.auth.loginWithRedirect();
  }
}
