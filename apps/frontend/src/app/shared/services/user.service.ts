import { Injectable } from '@angular/core';
import { User } from '@prisma/generated-client';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _user: User | null = null;
  private _profilePictureUrl: string | null = null;

  get user(): User | null {
    return this._user;
  }

  set user(user: User | null) {
    this._user = user;
  }

  get profilePictureUrl(): string | null {
    return this._profilePictureUrl;
  }

  set profilePictureUrl(url: string | null) {
    this._profilePictureUrl = url;
  }

  clear(): void {
    this._user = null;
    this._profilePictureUrl = null;
  }
}
