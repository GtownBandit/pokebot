import { Component, inject } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-login-background',
  imports: [NgOptimizedImage],
  templateUrl: './login-background.component.html',
  styleUrl: './login-background.component.scss',
})
export class LoginBackgroundComponent {
  private auth = inject(Auth0Service);

  login() {
    this.auth.loginWithRedirect();
  }
}
