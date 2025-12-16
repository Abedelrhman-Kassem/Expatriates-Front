import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from '../core/constants/constants';

export interface ServiceModel {
  id?: number;
  name: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private http = inject(HttpClient);
  private apiUrl = baseUrl + 'services';

  getServices(): Observable<ServiceModel[]> {
    return this.http.get<ServiceModel[]>(this.apiUrl);
  }

  createService(service: ServiceModel): Observable<ServiceModel> {
    return this.http.post<ServiceModel>(this.apiUrl, service);
  }

  updateService(id: number, service: ServiceModel): Observable<ServiceModel> {
    return this.http.put<ServiceModel>(`${this.apiUrl}/${id}`, service);
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
