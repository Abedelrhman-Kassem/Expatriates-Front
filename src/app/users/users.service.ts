import { Injectable, signal } from '@angular/core';
import { Admin } from './users.component';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private users = signal<Admin[]>([]);

  setUsers(users: Admin[]) {
    this.users.set(users);
  }

  getUsers() {
    return this.users();
  }

  editUser(id: number, user: Admin) {
    const currentUsers = this.users();
    const index = currentUsers.findIndex((u) => u.id === id);
    if (index !== -1) {
      currentUsers[index] = { ...currentUsers[index], ...user };
      this.users.set([...currentUsers]);
    }
  }

  addUser(user: Admin) {
    const currentUsers = this.users();
    const newUser = { ...user };
    this.users.set([...currentUsers, newUser]);
  }

  deleteUser(id: number) {
    const currentUsers = this.users();
    const updatedUsers = currentUsers.filter((u) => u.id !== id);
    this.users.set(updatedUsers);
  }
}
