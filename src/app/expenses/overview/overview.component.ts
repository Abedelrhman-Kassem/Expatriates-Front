import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  Signal,
} from '@angular/core';
import { StudentModel } from '../../reports/reports.service';
import { baseUrl } from '../../core/constants/constants';
import { InputComponent } from '../../reports/input/input.component';
import { LoadingSpinnerComponent } from '../../core/components/loading-spinner/loading-spinner.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GridDisabledInputsComponent } from '../../reports/reports-main-table/student-info/grid-disabled-inputs/grid-disabled-inputs.component';
import { RouterLink } from '@angular/router';
import { ExpensesService } from '../expenses.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-overview',
  imports: [
    InputComponent,
    LoadingSpinnerComponent,
    ReactiveFormsModule,
    GridDisabledInputsComponent,
    RouterLink,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent implements OnInit {
  inputValues: Record<string, string> = {};
  isLoading: boolean = false;
  getStudent: boolean = false;

  http: HttpClient = inject(HttpClient);
  expenseService: ExpensesService = inject(ExpensesService);

  student: Signal<StudentModel> = signal({});
  toastr: ToastrService = inject(ToastrService);

  ngOnInit(): void {
    if (this.expenseService.student.id) {
      this.getStudent = true;
    }
    this.student = computed(() => this.expenseService.student);
  }

  onInputChange(value: string, field: string) {
    this.inputValues[field] = value;
  }

  sendRequest() {
    this.isLoading = true;
    this.getStudent = false;

    let params: HttpParams = new HttpParams();
    params = params.set('name', this.inputValues['name'] || '');

    params = params.append('code', this.inputValues['code'] || '');

    params = params.append(
      'submissionNumber',
      this.inputValues['submissionNumber'] || ''
    );

    this.http.get(baseUrl + 'installments', { params }).subscribe({
      next: (response) => {
        this.student = computed(() => response);
        this.expenseService.student = response;

        this.getStudent = true;

        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error(error.error.message);
        this.getStudent = false;
        this.student = computed(() => ({}));
        this.isLoading = false;
      },
    });
  }
}
