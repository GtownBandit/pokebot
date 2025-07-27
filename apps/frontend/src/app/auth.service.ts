import { inject, Injectable } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth0 = inject(Auth0Service);

  async isAuthenticated(): Promise<boolean> {
    return await firstValueFrom(this.auth0.isAuthenticated$);
  }
}
