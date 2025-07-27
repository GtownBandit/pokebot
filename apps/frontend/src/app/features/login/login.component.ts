import { Component, inject } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [NgOptimizedImage],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private auth = inject(Auth0Service);

  login() {
    this.auth.loginWithRedirect();
  }
}
