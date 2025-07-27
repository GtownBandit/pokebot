import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { environment } from '../../environments/environment';
import { routes } from '../app.routes';
import { AuthModule } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      AuthModule.forRoot({
        domain: environment.authDomain,
        clientId: environment.authClientId,
        authorizationParams: {
          redirect_uri: window.location.origin,
          audience: environment.authAudience,
        },
      }),
    ),
  ],
};
