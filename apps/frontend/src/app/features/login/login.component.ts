import { Component, inject } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { LoginBackgroundComponent } from '../login-background/login-background.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [LoginBackgroundComponent],
})
export class LoginComponent {
  private auth = inject(Auth0Service);

  login() {
    console.log(JSON.stringify(environment));
    this.auth.loginWithRedirect();
  }
}
