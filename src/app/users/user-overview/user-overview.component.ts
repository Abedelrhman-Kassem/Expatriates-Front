import {
  Component,
  computed,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { UsersService } from '../users.service';
import { UserCardComponent } from '../user-card/user-card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-overview',
  imports: [UserCardComponent, RouterLink],
  templateUrl: './user-overview.component.html',
  styleUrl: './user-overview.component.css',
})
export class UserOverviewComponent {
  isSuperAdmin: WritableSignal<boolean> = signal(false);

  constructor() {
    this.getIsSuperAdmin();
  }

  usersService = inject(UsersService);
  users = computed(() => this.usersService.getUsers());

  protected getIsSuperAdmin(): void {
    const superAdmin: boolean = JSON.parse(
      sessionStorage.getItem('superAdmin') || 'false'
    );

    this.isSuperAdmin.set(superAdmin);
  }
}
