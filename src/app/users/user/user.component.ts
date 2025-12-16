import { Component, inject, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Admin } from '../users.component';
import { UsersService } from '../users.service';
import { baseUrl } from '../../core/constants/constants';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export interface AdminResponseModel {
  admin?: Admin;
  message?: string;
}

@Component({
  selector: 'app-user',
  imports: [FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  usersService = inject(UsersService);
  http = inject(HttpClient);
  route = inject(ActivatedRoute);
  router = inject(Router);
  toastr = inject(ToastrService);

  admin = {
    username: '',
    name: '',
    password: '',
    addNominations: false,
    viewPrintReports: false,
    addFees: false,
    addEnrollmentData: false,
    printPermissions: false,
    superAdmin: false,
  };

  error: string = '';
  loading: boolean = false;
  isEditMode: boolean = false;
  adminId: string | null = null;

  ngOnInit(): void {
    this.adminId = this.route.snapshot.paramMap.get('id');
    if (this.adminId) {
      // Edit mode: load admin data
      this.isEditMode = true;
      const user = this.usersService
        .getUsers()
        .find((u) => u.id?.toString() === this.adminId);
      if (user) {
        this.admin = {
          username: user.username ?? '',
          name: user.name ?? '',
          password: '',
          addNominations: user.addNominations ?? false,
          viewPrintReports: user.viewPrintReports ?? false,
          addFees: user.addFees ?? false,
          addEnrollmentData: user.addEnrollmentData ?? false,
          printPermissions: user.printPermissions ?? false,
          superAdmin: user.superAdmin ?? false,
        };
      }
    } else {
      // Create mode: keep admin as empty
      this.isEditMode = false;
    }
  }

  save() {
    this.loading = true;
    this.error = '';
    if (this.isEditMode && this.adminId) {
      // Update existing admin
      this.http
        .put<AdminResponseModel>(baseUrl + 'admins/' + this.adminId, this.admin)
        .subscribe({
          next: (data: any) => {
            this.usersService.editUser(Number(this.adminId), this.admin);
            this.loading = false;
            this.router.navigate(['/users']);

            this.toastr.success('تم تعديل المستخدم بنجاح', '', {
              positionClass: 'toast-bottom-right',
            });
          },
          error: (error) => {
            let errorMessage =
              error.status < 500
                ? error.error.message
                : 'حدث خطأ أثناء تعديل المستخدم';

            this.toastr.error(errorMessage, '', {
              positionClass: 'toast-bottom-right',
            });
            this.loading = false;
          },
        });
    } else {
      // Create new admin
      this.http
        .post<AdminResponseModel>(baseUrl + 'admins', this.admin)
        .subscribe({
          next: (data: any) => {
            this.usersService.addUser(data.admin);
            this.loading = false;
            this.router.navigate(['/users']);

            this.toastr.success('تم إنشاء المستخدم بنجاح', '', {
              positionClass: 'toast-bottom-right',
            });
          },
          error: (error) => {
            let errorMessage =
              error.status < 500
                ? error.error.message
                : 'حدث خطأ أثناء إنشاء المستخدم';

            this.toastr.error(errorMessage, '', {
              positionClass: 'toast-bottom-right',
            });

            this.loading = false;
          },
        });
    }
  }

  deleteAdmin() {
    if (!this.adminId) return;

    this.loading = true;
    this.error = '';
    this.http.delete(baseUrl + 'admins/' + this.adminId).subscribe({
      next: () => {
        this.usersService.deleteUser(Number(this.adminId));
        this.loading = false;
        this.router.navigate(['/users']);

        this.toastr.success('تم حذف المستخدم بنجاح', '', {
          positionClass: 'toast-bottom-right',
        });
      },
      error: (error) => {
        let errorMessage =
          error.status < 500
            ? error.error.message
            : 'حدث خطأ أثناء حذف المستخدم';

        this.toastr.error(errorMessage, '', {
          positionClass: 'toast-bottom-right',
        });

        this.loading = false;
      },
    });
  }
}
