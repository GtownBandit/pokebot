import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UnauthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async canActivate(): Promise<boolean> {
    const isAuth = await firstValueFrom(this.authService.isAuthenticated$);
    if (isAuth) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}
