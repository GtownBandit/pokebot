import { Injectable } from '@angular/core';
import { User } from '../../../prisma-types';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _user: User | null = null;

  get user(): User | null {
    return this._user;
  }

  set user(user: User | null) {
    this._user = user;
  }

  clear(): void {
    this._user = null;
  }
}
