import { Component } from '@angular/core';
import { AuthService } from '../../core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';

@Component({
  selector: 'app-auth-test',
  standalone: true,
  templateUrl: './auth-test.component.html',
})
export class AuthTestComponent {
  constructor(
    private authService: AuthService,
    private auth0Service: Auth0Service,
  ) {}

  get twitchId(): string | null {
    return this.authService.getTwitchId();
  }

  logout(): void {
    this.auth0Service.logout();
  }
}
