import { Component, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-auth-test',
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './auth-test.component.html',
})
export class AuthTestComponent {
  private auth = inject(AuthService);

  user$ = this.auth.user$;
  isAuthenticated$ = this.auth.isAuthenticated$;

  login() {
    console.log(environment);
    this.auth.loginWithRedirect();
  }

  logout() {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}
