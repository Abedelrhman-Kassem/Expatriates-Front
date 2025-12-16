import { Component, inject } from '@angular/core';
import { InputComponent } from '../reports/input/input.component';
import { collegeValues, gradeValues } from '../main/types.module';
import { SelectInputComponent } from '../main/select-input/select-input.component';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../core/constants/constants';
import { LoadingSpinnerComponent } from '../core/components/loading-spinner/loading-spinner.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-enrollments',
  standalone: true,
  imports: [
    InputComponent,
    SelectInputComponent,
    FormsModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './enrollments.component.html',
  styleUrl: './enrollments.component.css',
})
export class EnrollmentsComponent {
  gradeValues: string[] = gradeValues;
  collegeValues: string[] = collegeValues;

  inputValues: Record<string, string> = {};
  showRequiredFields: boolean = false;
  collegeFieldError: boolean = false;
  isLoading: boolean = false;

  http: HttpClient = inject(HttpClient);

  toastr: ToastrService = inject(ToastrService);

  sendRequest() {
    if (
      !this.inputValues['passportNumber']?.trim() &&
      !this.inputValues['submissionNumber']?.trim()
    ) {
      this.showRequiredFields = true;
    } else {
      this.showRequiredFields = false;
    }

    if (!collegeValues.includes(this.inputValues['college']?.trim())) {
      this.collegeFieldError = true;
    } else {
      this.collegeFieldError = false;
    }

    if (this.showRequiredFields || this.collegeFieldError) {
      return;
    }

    this.isLoading = true;
    this.http.post(baseUrl + 'enrollment', this.inputValues).subscribe({
      next: (response) => {
        this.toastr.success('تم تقييد الطلب بنجاح', '');

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

  onInputChange(value: string, field: string) {
    this.inputValues[field] = value;
  }
}
