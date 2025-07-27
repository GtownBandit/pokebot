import { inject, Injectable } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth0 = inject(Auth0Service);

  async isAuthenticated(): Promise<boolean> {
    return await firstValueFrom(this.auth0.isAuthenticated$);
  }

  /**
   * Extracts and persistently saves the Twitch ID from the Auth0 user payload.
   * Call this after a successful login or when user info is available.
   */
  saveTwitchIdFromUser(user: any): void {
    if (user?.sub) {
      const segments = user.sub.split('|');
      if (segments.length === 3 && segments[1] === 'twitch') {
        const twitchId = segments[2];
        localStorage.setItem('twitch_id', twitchId);
      }
    }
  }

  /**
   * Retrieve the persisted Twitch ID from localStorage.
   */
  getTwitchId(): string | null {
    return localStorage.getItem('twitch_id');
  }

  /**
   * Returns the current Auth0 user payload as a Promise.
   */
  async getUser(): Promise<any> {
    return await firstValueFrom(this.auth0.user$);
  }
}
