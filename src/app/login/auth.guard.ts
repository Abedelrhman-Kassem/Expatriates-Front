import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = auth.checkAuth();

  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};

export const superAdminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isSuperAdmin = auth.isSuperAdmin();

  if (!isSuperAdmin) {
    router.navigate(['/createStudent']);
    return false;
  }

  return true;
};
