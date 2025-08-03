import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '@prisma/generated-client';
import { environment } from '../../../../environments/environment';
import { AuthService } from '@auth0/auth0-angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  get user(): User {
    return this.userService.user!;
  }

  get profilePictureUrl(): string | null {
    return this.userService.profilePictureUrl;
  }

  logout(): void {
    this.authService.logout({
      logoutParams: { returnTo: environment.frontendURL },
    });
  }
}
