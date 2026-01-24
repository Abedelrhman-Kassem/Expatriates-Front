import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../../core/constants/constants';
import { Observable } from 'rxjs';

export interface College {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CollegeService {
  private http = inject(HttpClient);
  private apiUrl = baseUrl + 'colleges';

  getColleges(): Observable<College[]> {
    return this.http.get<College[]>(this.apiUrl);
  }
}
