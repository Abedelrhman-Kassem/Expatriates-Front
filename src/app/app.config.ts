import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { checkInvalidToken, setToken } from './core/helpers/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([setToken, checkInvalidToken])),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(), // required animations providers
    provideToastr(), // Toastr providers
  ],
};
