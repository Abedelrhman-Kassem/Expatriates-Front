import { Injectable } from '@angular/core';
import { StudentModel } from '../reports/reports.service';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  student: StudentModel = {};

  constructor() {}
}

export interface RequirementsModel {
  admissionYear?: string;
  amount?: number;
  createdAt?: string;
  grade?: string;
  id?: number;
  studentId?: number;
  updatedAt?: string;
  installments?: InstallmentsModel[];
}

export interface InstallmentsModel {
  amount?: number;
  createdAt?: string;
  id?: number;
  requirementId?: number;
  updatedAt?: string;
  title?: string;
  operationNumber?: string;
}
