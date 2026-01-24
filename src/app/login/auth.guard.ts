import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service.service';

/**
 * Guard to check if user is authenticated
 */
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

/**
 * Guard to check if user is super admin
 */
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

/**
 * Factory function to create a permission-based guard
 * @param requiredPermissions Array of permission names (checks if user has ANY of them)
 */
export const permissionGuard = (
  requiredPermissions: string[]
): CanActivateFn => {
  return (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.hasAnyPermission(requiredPermissions)) {
      router.navigate(['/createStudent']);
      return false;
    }
    return true;
  };
};

/**
 * Factory function to create a guard requiring ALL permissions
 * @param requiredPermissions Array of permission names (checks if user has ALL of them)
 */
export const allPermissionsGuard = (
  requiredPermissions: string[]
): CanActivateFn => {
  return (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.hasAllPermissions(requiredPermissions)) {
      router.navigate(['/createStudent']);
      return false;
    }
    return true;
  };
};
