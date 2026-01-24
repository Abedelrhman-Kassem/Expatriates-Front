import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../constants/constants';
import { Observable } from 'rxjs';

export interface Installment {
  id?: number;
  studentId: number;
  year: string;
  amount: number;
  receiptNumber?: string;
  receiptType?: 'فردى' | 'مجمع';
  paymentDate?: string;
  isPaid: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface YearSection {
  year: string;
  requiredAmount: number;
  isCustomAmount: boolean;
  collegeDefault: number;
  studentStatus: string;
  paidAmount: number;
  remainingAmount: number;
  installments: Installment[];
  canAddInstallment: boolean;
}

export interface StudentExpensesSummary {
  totalRequired: number;
  totalPaid: number;
  totalRemaining: number;
}

export interface StudentInfo {
  id: number;
  name: string;
  submissionNumber: string;
  college: string;
  admissionYear: string;
}

export interface StudentExpensesResponse {
  student: StudentInfo;
  summary: StudentExpensesSummary;
  yearSections: YearSection[];
}

@Injectable({
  providedIn: 'root',
})
export class StudentExpensesService {
  private http = inject(HttpClient);
  private apiUrl = baseUrl + 'student-expenses';

  getStudentExpenses(studentId: number): Observable<StudentExpensesResponse> {
    return this.http.get<StudentExpensesResponse>(`${this.apiUrl}/${studentId}`);
  }

  updateYearData(
    studentId: number,
    year: string,
    data: { customAmount?: number | null; studentStatus?: string }
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/${studentId}/year`, { year, ...data });
  }

  createInstallment(
    studentId: number,
    year: string,
    amount: number,
    receiptType?: string
  ): Observable<{ message: string; installment: Installment }> {
    return this.http.post<{ message: string; installment: Installment }>(
      `${this.apiUrl}/${studentId}/installment`,
      { year, amount, receiptType }
    );
  }

  updateInstallment(
    installmentId: number,
    data: { receiptNumber?: string; receiptType?: string; isPaid?: boolean }
  ): Observable<{ message: string; installment: Installment }> {
    return this.http.put<{ message: string; installment: Installment }>(
      `${this.apiUrl}/installment/${installmentId}`,
      data
    );
  }

  deleteInstallment(installmentId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/installment/${installmentId}`
    );
  }
}
