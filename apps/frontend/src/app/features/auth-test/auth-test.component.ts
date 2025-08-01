import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';
import { Pokemon } from '@prisma/generated-client';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-auth-test',
  standalone: true,
  templateUrl: './auth-test.component.html',
  imports: [JsonPipe],
})
export class AuthTestComponent {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private http: HttpClient,
  ) {}

  apiResponse: Pokemon[] | null = null;

  get twitchId(): string | null {
    return this.userService.user?.twitchId ?? null;
  }

  testAPI(): void {
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
    this.authService.logout({
      logoutParams: { returnTo: environment.frontendURL },
    });
  }
}
