import { Component, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl } from '../core/constants/constants';
import { UsersService } from './users.service';
import { RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export interface Admin {
  id?: number;
  username?: string;
  name?: string;
  addNominations?: boolean;
  viewPrintReports?: boolean;
  addFees?: boolean;
  addEnrollmentData?: boolean;
  printPermissions?: boolean;
  superAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  imports: [RouterOutlet],
})
export class UsersComponent {
  usersService = inject(UsersService);
  http = inject(HttpClient);
  toastr = inject(ToastrService);
  loading = true;

  ngOnInit() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');

    this.http.get<Admin[]>(baseUrl + 'admins', { headers }).subscribe({
      next: (data) => {
        this.usersService.setUsers(data);
        this.loading = false;
      },
      error: (error) => {
        let errorMessage =
          error.status < 500 ? error.error.message : 'حدث خطأ غير متوقع';

        this.toastr.error(errorMessage, '', {
          positionClass: 'toast-bottom-right',
        });

        this.loading = false;
        console.error('Error fetching users:', error);
      },
    });
  }
}
