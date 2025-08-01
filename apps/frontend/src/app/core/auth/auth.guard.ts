import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async canActivate(): Promise<boolean> {
    const isAuth = await firstValueFrom(this.authService.isAuthenticated$);
    if (!isAuth) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
