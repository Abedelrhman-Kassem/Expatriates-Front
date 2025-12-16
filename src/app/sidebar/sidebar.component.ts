import { Component, inject } from '@angular/core';
import { ButtonComponent } from './button/button.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '../login/auth-service.service';

@Component({
  selector: 'app-sidebar',
  imports: [ButtonComponent, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  authService = inject(AuthService);

  superAdminCheck(): boolean {
    return (
      this.authService.isAuthenticated() && this.authService.isSuperAdmin()
    );
  }
}
