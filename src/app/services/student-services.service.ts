import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from '../core/constants/constants';

export interface StudentServiceModel {
  id?: number;
  studentId: number;
  serviceId: number;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class StudentServicesService {
  private http = inject(HttpClient);
  private apiUrl = baseUrl + 'student-services';

  getStudentServices(studentId?: number): Observable<StudentServiceModel[]> {
    const url = studentId 
      ? `${this.apiUrl}?studentId=${studentId}`
      : this.apiUrl;
    return this.http.get<StudentServiceModel[]>(url);
  }

  createStudentService(data: { studentId: number; serviceId: number }): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateStudentServiceStatus(id: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, { status });
  }

  deleteStudentService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
