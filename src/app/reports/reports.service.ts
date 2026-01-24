import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { baseUrl } from '../core/constants/constants';
import { ToastrService } from 'ngx-toastr';
import { PaginatedResult } from '../core/pagenationMode';

@Injectable({ providedIn: 'root' })
export default class ReportsService {
  constructor(private httpClient: HttpClient, private toastr: ToastrService) {}

  reportResult: WritableSignal<PaginatedResult<StudentModel>> = signal({
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    items: [],
  });

  isSearching: WritableSignal<boolean> = signal(false);

  getStudents(report: StudentModel, page: number = 1, limit: number = 50) {
    let params = new HttpParams();
    Object.entries(report).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value);
      }
    });

    params = params.set('page', page.toString());
    params = params.set('limit', limit.toString());

    this.isSearching.set(true);

    this.httpClient.get(baseUrl + 'students', { params }).subscribe({
      next: (response) => {
        this.reportResult.set(response as PaginatedResult<StudentModel>);

        this.isSearching.set(false);
      },
      error: (error) => {
        let errorMessage =
          error.status < 500 ? error.error.message : 'حدث خطأ غير متوقع';

        this.toastr.error(errorMessage, '', {
          positionClass: 'toast-bottom-right',
        });

        this.isSearching.set(false);
      },
      complete: () => {
        this.isSearching.set(false);
      },
    });
  }

  downloadReport(report: StudentModel) {
    let params = new HttpParams();
    Object.entries(report).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value);
      }
    });

    return this.httpClient.get(baseUrl + 'reports', {
      params,
      observe: 'response',
      responseType: 'blob',
    });
  }

  deleteStudent(id: string) {
    return this.httpClient.delete(baseUrl + 'students/' + id);
  }
}

export interface StudentModel {
  id?: string;
  name?: string;
  submissionNumber?: string;
  code?: string;
  nationality?: string;
  passportNumber?: string;
  idNumber?: string;
  college?: string;
  gender?: string;
  grade?: any;
  certificateCountry?: string;
  admissionYear?: string;
  exemptionStatus?: string;
  studentStatus?: string;
  major?: string;
  birthDate?: string;
  placeOfResidence?: string;
  email?: string;
  universityEmail?: any;
  whatsNumber?: string;
  number?: string;
  requestType?: string;
  entryType?: string;
  educationStage?: string;
  educationType?: string;
  applicationType?: string;
  formatType?: string;
  percentage?: string;
  createdAt?: string;
  updatedAt?: string;
}
