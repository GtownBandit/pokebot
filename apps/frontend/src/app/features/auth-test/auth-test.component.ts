import { Component } from '@angular/core';
import { AuthService } from '../../core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';
import { Pokemon } from '../../../prisma-types';

@Component({
  selector: 'app-auth-test',
  standalone: true,
  templateUrl: './auth-test.component.html',
  imports: [JsonPipe],
})
export class AuthTestComponent {
  constructor(
    private authService: AuthService,
    private auth0Service: Auth0Service,
    private http: HttpClient,
  ) {}

  apiResponse: Pokemon[] | null = null;

  get twitchId(): string | null {
    return this.authService.getTwitchId();
  }

  testAPI(): void {
    this.auth0Service.getAccessTokenSilently().subscribe((accessToken) => {
      console.log(accessToken);
    });
    this.auth0Service.isAuthenticated$.subscribe((isAuthenticated) => {
      console.log(isAuthenticated);
    });
    console.log(environment.backendURL + '/*');
    this.http
      .get<Pokemon[]>(`${environment.backendURL}/pokemon-instances`)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.apiResponse = data;
        },
        error: (error) => {
          console.error('API fetch error:', error);
        },
      });
  }

  logout(): void {
    this.auth0Service.logout({
      logoutParams: { returnTo: environment.frontendURL },
    });
  }
}
