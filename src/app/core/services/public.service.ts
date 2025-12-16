import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { loginUrl } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class PublicService {
  private apiUrl = loginUrl + 'public';

  constructor(private http: HttpClient) {}

  getStudentBySubmissionNumber(submissionNumber: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/${submissionNumber}`);
  }

  getServices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/services`);
  }
}
