import { computed, Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _isAuthenticated = signal<boolean>(false);

  isAuthenticated = computed(() => this._isAuthenticated());
  isSuperAdmin: Signal<boolean> = computed(() => {
    // Depend on _isAuthenticated to force re-evaluation when login status changes
    this._isAuthenticated();
    return JSON.parse(sessionStorage.getItem('superAdmin') || 'false');
  });

  login(token: string, superAdmin: boolean): void {
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('superAdmin', JSON.stringify(superAdmin));
    this._isAuthenticated.set(true);
    console.log('Login Successful. Token Payload:', this.decodeToken(token));
  }

  logout(): void {
    sessionStorage.clear();
    window.location.href = '/login';
    this._isAuthenticated.set(false);
  }

  checkAuth(): boolean {
    const token = sessionStorage.getItem('authToken');
    const isLogged = !!token;
    this._isAuthenticated.set(isLogged);
    return isLogged;
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  // ==================== Permission Methods ====================

  /**
   * Get all permissions from token
   */
  getPermissions(): string[] {
    const token = sessionStorage.getItem('authToken');
    if (!token) return [];
    const decoded = this.decodeToken(token);
    return decoded?.permissions || [];
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: string): boolean {
    if (this.isSuperAdmin()) return true;
    const permissions = this.getPermissions();
    if (permissions.includes('*')) return true;
    return permissions.includes(permission);
  }

  /**
   * Check if user has ANY of the specified permissions
   */
  hasAnyPermission(permissions: string[]): boolean {
    if (this.isSuperAdmin()) return true;
    const userPermissions = this.getPermissions();
    if (userPermissions.includes('*')) return true;
    return permissions.some((p) => userPermissions.includes(p));
  }

  /**
   * Check if user has ALL of the specified permissions
   */
  hasAllPermissions(permissions: string[]): boolean {
    if (this.isSuperAdmin()) return true;
    const userPermissions = this.getPermissions();
    if (userPermissions.includes('*')) return true;
    return permissions.every((p) => userPermissions.includes(p));
  }

  // ==================== Admin Type Methods ====================

  getAdminType(): 'system' | 'college' | null {
    const token = sessionStorage.getItem('authToken');
    if (!token) return null;
    const decoded = this.decodeToken(token);
    return decoded?.adminType || null;
  }

  getAdminCollege(): string | null {
    const token = sessionStorage.getItem('authToken');
    if (!token) return null;
    const decoded = this.decodeToken(token);
    return decoded?.college || null;
  }

  readonly adminType = computed(() => {
    this._isAuthenticated();
    return this.getAdminType();
  });

  readonly adminCollege = computed(() => {
    this._isAuthenticated();
    return this.getAdminCollege();
  });

  readonly isSystemAdmin = computed(() => this.adminType() === 'system');
  readonly isCollegeAdmin = computed(() => this.adminType() === 'college');
}
