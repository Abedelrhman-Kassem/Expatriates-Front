import { Component, inject, signal } from '@angular/core';
import { AuthService } from './auth-service.service';
import { Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { loginUrl } from '../core/constants/constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  http = inject(HttpClient);
  toastr: ToastrService = inject(ToastrService);

  username = '';
  password = '';
  error = '';

  isLoading = signal<boolean>(false);

  login() {
    if (this.isLoading()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const url = loginUrl + 'login';
    this.http
      .post(url, { username: this.username, password: this.password })
      .subscribe({
        next: (res: any) => {
          if (res && res.token) {
            this.authService.login(res.token, res.superAdmin || false);
            this.router.navigate(['/']);
          } else {
            this.error = 'فشل تسجيل الدخول';
          }

          this.isLoading.set(false);
        },
        error: (error) => {
          let errorMessage =
            error.status < 500
              ? error.error.message || 'تأكد من اتصالك بالإنترنت'
              : 'حدث خطأ غير متوقع';

          this.toastr.error(errorMessage, '', {
            positionClass: 'toast-bottom-right',
          });
          this.isLoading.set(false);
        },
      });
  }

  form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
}
