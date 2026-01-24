import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../../core/constants/constants';
import { Observable } from 'rxjs';

export interface CollegeExpense {
  id?: number;
  collegeId: number;
  year: string;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CollegeExpensesService {
  private http = inject(HttpClient);
  private apiUrl = baseUrl + 'college-expenses';

  getExpensesInCollege(collegeId: number): Observable<CollegeExpense[]> {
    return this.http.get<CollegeExpense[]>(`${this.apiUrl}/${collegeId}`);
  }

  createOrUpdateExpense(expense: CollegeExpense): Observable<CollegeExpense> {
    return this.http.post<CollegeExpense>(this.apiUrl, expense);
  }

  deleteExpense(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
