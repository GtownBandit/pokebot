import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '@auth0/auth0-angular';
import { User } from '@prisma/generated-client';
import { UserService } from '../../shared/services/user.service';

@Injectable({ providedIn: 'root' })
export class UserResolver implements Resolve<any> {
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  resolve(): Observable<any> {
    return this.authService.user$.pipe(
      take(1),
      switchMap((user: any) => {
        const username = user.twitch_username;

        let twitchId = null;
        if (user?.sub) {
          const segments = user.sub.split('|');
          if (
            segments.length === 3 &&
            (segments[1] === 'twitch' || segments[1] === 'custom-twitch')
          ) {
            twitchId = segments[2];
          }
        }
        return this.http
          .post<User>(`${environment.backendURL}/user`, {
            username,
            twitchId,
          })
          .pipe(
            tap((userResponse: User) => {
              this.userService.user = userResponse;
              this.userService.profilePictureUrl = user.picture ?? null;
            }),
          );
      }),
      catchError((err) => {
        console.error(err);
        this.authService.logout({
          logoutParams: { returnTo: environment.frontendURL },
        });
        return of(null);
      }),
    );
  }
}
