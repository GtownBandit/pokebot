import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthResolver implements Resolve<Promise<boolean>> {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async resolve(): Promise<boolean> {
    const isAuth = await this.authService.isAuthenticated();
    if (isAuth) {
      // Get the user payload from Auth0 and save the Twitch ID
      const user = await this.authService.getUser();
      this.authService.saveTwitchIdFromUser(user);
      this.router.navigate(['/auth-test']);
      return false;
    }
    return true;
  }
}
