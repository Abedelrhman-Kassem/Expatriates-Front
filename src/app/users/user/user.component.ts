import { Component, inject, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Admin, Role, Permission } from '../users.component';
import { collegeValues } from '../../main/types.module';
import { UsersService } from '../users.service';
import { baseUrl } from '../../core/constants/constants';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

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

  admin: Admin = {
    username: '',
    name: '',
    password: '',
    superAdmin: false,
    adminType: 'system',
    roleIds: [],
    permissionIds: [],
  };

  availableRoles: Role[] = [];
  availablePermissions: Permission[] = [];
  collegeValues: string[] = collegeValues;

  error: string = '';
  loading: boolean = false;
  isEditMode: boolean = false;
  adminId: string | null = null;

  ngOnInit(): void {
    // Fetch available roles and permissions
    this.fetchRolesAndPermissions();

    this.adminId = this.route.snapshot.paramMap.get('id');
    if (this.adminId) {
      this.isEditMode = true;
      const user = this.usersService
        .getUsers()
        .find((u) => u.id?.toString() === this.adminId);
      if (user) {
        this.admin = {
          ...user,
          password: '',
          roleIds: user.roles?.map((r) => r.id) || [],
          permissionIds: user.directPermissions?.map((p) => p.id) || [],
        };
      } else {
        // Fallback if user not found in service (e.g. refresh)
        this.fetchUser(this.adminId);
      }
    } else {
      this.isEditMode = false;
    }
  }

  fetchRolesAndPermissions() {
    forkJoin({
      roles: this.http.get<Role[]>(baseUrl + 'admins/roles'),
      permissions: this.http.get<Permission[]>(baseUrl + 'admins/permissions'),
    }).subscribe({
      next: (data) => {
        this.availableRoles = data.roles;
        this.availablePermissions = data.permissions;
      },
      error: (err) => console.error('Error fetching RBAC data:', err),
    });
  }

  fetchUser(id: string) {
    this.http.get<Admin>(baseUrl + 'admins/' + id).subscribe({
      next: (user) => {
        this.admin = {
          ...user,
          password: '',
          roleIds: user.roles?.map((r) => r.id) || [],
          permissionIds: user.directPermissions?.map((p) => p.id) || [],
        };
      },
      error: (err) => console.error('Error fetching user:', err),
    });
  }

  save() {
    this.loading = true;
    this.error = '';

    if (this.isEditMode && this.adminId) {
      // Sync adminType based on roles
      this.syncAdminTypeWithRoles();

      // Update existing admin
      // 1. Update basic info
      const updateBasic = this.http.put<AdminResponseModel>(
        baseUrl + 'admins/' + this.adminId,
        this.admin
      );

      // 2. Update roles
      const updateRoles = this.http.put(
        baseUrl + 'admins/' + this.adminId + '/roles',
        { roleIds: this.admin.roleIds }
      );

      // 3. Update permissions
      const updatePermissions = this.http.put(
        baseUrl + 'admins/' + this.adminId + '/permissions',
        { permissionIds: this.admin.permissionIds }
      );

      forkJoin([updateBasic, updateRoles, updatePermissions]).subscribe({
        next: ([basicRes, rolesRes, permsRes]: [any, any, any]) => {
          // Update local state is tricky because we need the full objects back
          // Ideally we fetch the user again or construct the object manually
          // For simplicity, let's just navigate back and let the users list refresh or update minimally
          // Or simpler: just reload the page or navigate away

          // If we want to update the service:
          // We need the roles and permissions objects corresponding to the IDs
          const updatedRoles = this.availableRoles.filter((r) =>
            this.admin.roleIds?.includes(r.id)
          );
          const updatedPerms = this.availablePermissions.filter((p) =>
            this.admin.permissionIds?.includes(p.id)
          );

          // We merge these into the admin object to update the service
          const updatedAdmin = {
            ...this.admin,
            roles: updatedRoles,
            directPermissions: updatedPerms,
          };

          this.usersService.editUser(Number(this.adminId), updatedAdmin);
          this.loading = false;
          this.router.navigate(['/users']);
          this.toastr.success('تم تعديل المستخدم بنجاح', '', {
            positionClass: 'toast-bottom-right',
          });
        },
        error: (error) => {
          this.handleError(error);
        },
      });
    } else {
      // Create new admin
      this.syncAdminTypeWithRoles();
      this.http
        .post<AdminResponseModel>(baseUrl + 'admins', this.admin)
        .subscribe({
          next: (data: any) => {
            // The response should include the created admin, hopefully with roles/permissions populated
            // But if not, we might need to manually attach them or fetch again
            // Assuming the backend returns the created admin but maybe not the relation objects fully if not queried
            // Our backend create returns: admin: newAdmin.toJSON() without relations attached in response
            // So we might need to attach them locally for the UI List
            const newAdmin = data.admin;
            // Ideally fetching the created user is safer but for speed:
            newAdmin.roles = this.availableRoles.filter((r) =>
              this.admin.roleIds?.includes(r.id)
            );
            newAdmin.directPermissions = this.availablePermissions.filter((p) =>
              this.admin.permissionIds?.includes(p.id)
            );

            this.usersService.addUser(newAdmin);
            this.loading = false;
            this.router.navigate(['/users']);

            this.toastr.success('تم إنشاء المستخدم بنجاح', '', {
              positionClass: 'toast-bottom-right',
            });
          },
          error: (error) => {
            this.handleError(error);
          },
        });
    }
  }

  handleError(error: any) {
    let errorMessage =
      error.status < 500
        ? error.error.message || error.message
        : 'حدث خطأ غير متوقع';

    this.toastr.error(errorMessage, '', {
      positionClass: 'toast-bottom-right',
    });
    this.loading = false;
  }

  toggleRole(roleId: number) {
    if (this.admin.roleIds?.includes(roleId)) {
      this.admin.roleIds = this.admin.roleIds.filter((id) => id !== roleId);
    } else {
      this.admin.roleIds = [...(this.admin.roleIds || []), roleId];
    }
  }

  togglePermission(permissionId: number) {
    if (this.admin.permissionIds?.includes(permissionId)) {
      this.admin.permissionIds = this.admin.permissionIds.filter(
        (id) => id !== permissionId
      );
    } else {
      this.admin.permissionIds = [
        ...(this.admin.permissionIds || []),
        permissionId,
      ];
    }
  }

  isRoleSelected(roleId: number): boolean {
    return this.admin.roleIds?.includes(roleId) ?? false;
  }

  isPermissionSelected(permissionId: number): boolean {
    return this.admin.permissionIds?.includes(permissionId) ?? false;
  }

  isPermissionInRoles(permissionId: number): boolean {
    if (!this.admin.roleIds || this.admin.roleIds.length === 0) return false;

    // Find selected roles
    const selectedRoles = this.availableRoles.filter((r) =>
      this.admin.roleIds?.includes(r.id)
    );

    // Check if any selected role has this permission
    return selectedRoles.some((role) =>
      role.permissions?.some((p) => p.id === permissionId)
    );
  }

  isCollegeAdminSelected(): boolean {
    const collegeAdminRole = this.availableRoles.find(
      (r) => r.name === 'college_admin'
    );
    return collegeAdminRole
      ? this.admin.roleIds?.includes(collegeAdminRole.id) ?? false
      : false;
  }

  syncAdminTypeWithRoles() {
    const collegeAdminRole = this.availableRoles.find(
      (r) => r.name === 'college_admin'
    );
    const isCollegeRoleSelected = collegeAdminRole
      ? this.admin.roleIds?.includes(collegeAdminRole.id)
      : false;

    if (isCollegeRoleSelected) {
      this.admin.adminType = 'college';
    } else {
      this.admin.adminType = 'system';
      this.admin.college = undefined; // Clear college if not college admin
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
        this.handleError(error);
      },
    });
  }
}
