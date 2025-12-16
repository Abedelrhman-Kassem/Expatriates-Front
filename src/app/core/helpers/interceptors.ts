import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export function setToken(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  const newRequest = request.clone({
    headers: request.headers.set(
      'token',
      sessionStorage.getItem('authToken') ?? ''
    ),
  });

  return next(newRequest);
}

export function checkInvalidToken(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const router = inject(Router);

  return next(request).pipe(
    tap({
      next: (response) => {},
      error: (error) => {
        if (error.error?.invalidToken || false) {
          router.navigate(['/login']);
        }
      },
    })
  );
}
