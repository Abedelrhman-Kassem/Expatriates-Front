import { Injectable, signal } from '@angular/core';
import { Student } from './types.module';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../core/constants/constants';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export default class CreateStudentService {
  constructor(private httpClient: HttpClient, private toastr: ToastrService) {}

  student: Student = {
    name: undefined,
    submissionNumber: undefined,
    nationality: undefined,
    passportNumber: undefined,
    idNumber: undefined,
    college: undefined,
    gender: undefined,
    certificateCountry: undefined,
    admissionYear: undefined,
    exemptionStatus: undefined,
    studentStatus: undefined,
    major: undefined,
    birthDate: undefined,
    placeOfResidence: undefined,
    email: undefined,
    whatsNumber: undefined,
    number: undefined,
    requestType: undefined,
    applicationType: undefined,
    educationStage: undefined,
    educationType: undefined,
    formatType: undefined,
    percentage: undefined,
  };

  validateStudent(): boolean {
    return Object.values(this.student).every((value) => value !== undefined);
  }

  isLoading = signal(false);

  async postStudent() {
    this.isLoading.set(true);

    if (!this.validateStudent()) {
      throw Error('بعض الحقول فارغة');
    }

    this.httpClient.post(baseUrl + 'students', this.student).subscribe({
      next: (response) => {
        this.toastr.success('تم إنشاء الطالب بنجاح', '', {
          positionClass: 'toast-bottom-right',
        });
      },
      error: (error) => {
        let errorMessage =
          error.status < 500 ? error.error.message : 'حدث خطأ غير متوقع';

        this.toastr.error(errorMessage, '', {
          positionClass: 'toast-bottom-right',
        });

        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }
}
