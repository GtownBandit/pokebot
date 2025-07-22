import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AuthModule } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      AuthModule.forRoot({
        domain: 'https://auth.pokebot.at',
        clientId: 'YtVam2xqYB7b5VX3sJLHMiILFrB7DJRK',
        authorizationParams: {
          redirect_uri: window.location.origin,
          audience: 'https://pokebot.at/api',
        },
      }),
    ),
  ],
};
