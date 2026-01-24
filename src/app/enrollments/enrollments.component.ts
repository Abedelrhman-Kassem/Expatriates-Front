import { Component, inject } from '@angular/core';
import { InputComponent } from '../reports/input/input.component';
import {
  collegeValues,
  gradeValues,
  studentStatusValues,
} from '../main/types.module';
import { SelectInputComponent } from '../main/select-input/select-input.component';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../core/constants/constants';
import { LoadingSpinnerComponent } from '../core/components/loading-spinner/loading-spinner.component';
import { ConfirmModalComponent } from '../core/components/confirm-modal/confirm-modal.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../login/auth-service.service';

@Component({
  selector: 'app-enrollments',
  standalone: true,
  imports: [
    InputComponent,
    SelectInputComponent,
    FormsModule,
    LoadingSpinnerComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './enrollments.component.html',
  styleUrl: './enrollments.component.css',
})
export class EnrollmentsComponent {
  gradeValues: string[] = gradeValues;
  collegeValues: string[] = collegeValues;
  studentStatusValues: string[] = studentStatusValues;

  inputValues: Record<string, string> = {};
  showRequiredFields: boolean = false;
  collegeFieldError: boolean = false;
  isLoading: boolean = false;
  studentFound: boolean = false;
  foundStudent: any = null;
  isCollegeAdmin: boolean = false;
  isStudentEnrolled: boolean = false; // Track if student is already enrolled
  showUnenrollModal: boolean = false; // Show confirmation modal

  http: HttpClient = inject(HttpClient);
  toastr: ToastrService = inject(ToastrService);
  authService: AuthService = inject(AuthService);

  ngOnInit() {
    // Get admin type and college from auth service
    this.isCollegeAdmin = this.authService.isCollegeAdmin();

    // If college admin, auto-set the college
    if (this.isCollegeAdmin) {
      const college = this.authService.adminCollege();
      if (college) {
        this.inputValues['college'] = college;
      }
    }
  }

  searchStudent() {
    if (
      !this.inputValues['name']?.trim() &&
      !this.inputValues['submissionNumber']?.trim()
    ) {
      this.showRequiredFields = true;
      return;
    }

    this.showRequiredFields = false;
    this.isLoading = true;

    const searchParams: any = {};
    if (this.inputValues['name']) {
      searchParams.name = this.inputValues['name'];
    }
    if (this.inputValues['submissionNumber']) {
      searchParams.submissionNumber = this.inputValues['submissionNumber'];
    }

    this.http.get(baseUrl + 'students', { params: searchParams }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.items && response.items.length > 0) {
          this.foundStudent = response.items[0];
          this.studentFound = true;

          // Check if student is already enrolled
          this.isStudentEnrolled = this.foundStudent.entryType === 'مقيد';

          // Pre-fill form fields if student is enrolled
          if (this.isStudentEnrolled) {
            this.inputValues['universityEmail'] =
              this.foundStudent.universityEmail || '';
            this.inputValues['college'] = this.foundStudent.college || '';
            this.inputValues['grade'] = this.foundStudent.grade || '';
            this.inputValues['major'] = this.foundStudent.major || '';
            this.inputValues['studentStatus'] =
              this.foundStudent.studentStatus || '';
            this.inputValues['placeOfResidence'] =
              this.foundStudent.placeOfResidence || '';
            this.inputValues['whatsNumber'] =
              this.foundStudent.whatsNumber || '';
            this.inputValues['number'] = this.foundStudent.number || '';
          }

          this.toastr.success('تم العثور على الطالب', '');
        } else {
          this.studentFound = false;
          this.isStudentEnrolled = false;
          this.toastr.error('لم يتم العثور على الطالب', '');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.studentFound = false;
        this.isStudentEnrolled = false;
        let errorMessage =
          error.status < 500 ? error.error.message : 'حدث خطأ غير متوقع';
        this.toastr.error(errorMessage, '', {
          positionClass: 'toast-bottom-right',
        });
      },
    });
  }

  sendRequest() {
    if (!this.studentFound) {
      this.toastr.error('الرجاء البحث عن الطالب أولاً', '');
      return;
    }

    if (!collegeValues.includes(this.inputValues['college']?.trim())) {
      this.collegeFieldError = true;
    } else {
      this.collegeFieldError = false;
    }

    if (this.collegeFieldError) {
      return;
    }

    this.isLoading = true;
    this.http.post(baseUrl + 'enrollment', this.inputValues).subscribe({
      next: (response) => {
        this.toastr.success('تم تقييد الطالب بنجاح', '');
        this.isLoading = false;
        // Reset form
        this.studentFound = false;
        this.foundStudent = null;
        this.isStudentEnrolled = false;
        this.inputValues = {};

        // Re-set college for college admin
        if (this.isCollegeAdmin) {
          const college = this.authService.adminCollege();
          if (college) {
            this.inputValues['college'] = college;
          }
        }
      },
      error: (error) => {
        this.isLoading = false;

        let errorMessage =
          error.status < 500 ? error.error.message : 'حدث خطأ غير متوقع';

        this.toastr.error(errorMessage, '', {
          positionClass: 'toast-bottom-right',
        });
      },
    });
  }

  updateStudent() {
    if (!this.foundStudent?.id) {
      this.toastr.error('الرجاء البحث عن الطالب أولاً', '');
      return;
    }

    this.isLoading = true;
    this.http
      .put(baseUrl + 'enrollment/' + this.foundStudent.id, this.inputValues)
      .subscribe({
        next: (response) => {
          this.toastr.success('تم تحديث بيانات الطالب بنجاح', '');
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          let errorMessage =
            error.status < 500 ? error.error.message : 'حدث خطأ غير متوقع';
          this.toastr.error(errorMessage, '', {
            positionClass: 'toast-bottom-right',
          });
        },
      });
  }

  openUnenrollModal() {
    if (!this.foundStudent?.id) {
      this.toastr.error('الرجاء البحث عن الطالب أولاً', '');
      return;
    }
    this.showUnenrollModal = true;
  }

  closeUnenrollModal() {
    this.showUnenrollModal = false;
  }

  confirmUnenroll() {
    this.showUnenrollModal = false;
    this.isLoading = true;
    this.http.delete(baseUrl + 'enrollment/' + this.foundStudent.id).subscribe({
      next: (response) => {
        this.toastr.success('تم إلغاء تقييد الطالب بنجاح', '');
        this.isLoading = false;
        // Reset form
        this.studentFound = false;
        this.foundStudent = null;
        this.isStudentEnrolled = false;
        this.inputValues = {};

        // Re-set college for college admin
        if (this.isCollegeAdmin) {
          const college = this.authService.adminCollege();
          if (college) {
            this.inputValues['college'] = college;
          }
        }
      },
      error: (error) => {
        this.isLoading = false;
        let errorMessage =
          error.status < 500 ? error.error.message : 'حدث خطأ غير متوقع';
        this.toastr.error(errorMessage, '', {
          positionClass: 'toast-bottom-right',
        });
      },
    });
  }

  onInputChange(value: string, field: string) {
    this.inputValues[field] = value;
  }
}
