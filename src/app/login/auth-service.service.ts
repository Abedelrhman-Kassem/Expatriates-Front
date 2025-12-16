import {
  computed,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _isAuthenticated = signal<boolean>(false);

  isAuthenticated = computed(() => this._isAuthenticated());
  isSuperAdmin: Signal<boolean> = computed(() =>
    JSON.parse(sessionStorage.getItem('superAdmin') || 'false')
  );
  
  hasAddFeesPermission: Signal<boolean> = computed(() => {
    const token = sessionStorage.getItem('authToken');
    if (!token) return false;
    const decoded = this.decodeToken(token);
    return decoded?.addFees || false;
  });

  login(token: string, superAdmin: boolean): void {
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('superAdmin', JSON.stringify(superAdmin));
    this._isAuthenticated.set(true);
  }

  logout(): void {
    sessionStorage.clear();
    // localStorage.clear();

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
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }
}
