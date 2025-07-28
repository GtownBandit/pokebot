import { Component } from '@angular/core';
import { AuthService } from '../../core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';

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

  apiResponse: any = null;

  get twitchId(): string | null {
    return this.authService.getTwitchId();
  }

  testAPI(): void {
    this.http.get(`${environment.backendURL}/pokemon`).subscribe({
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
    this.auth0Service.logout();
  }
}
