import { Component, computed, inject, Signal, signal } from '@angular/core';
import { LoadingSpinnerComponent } from '../../core/components/loading-spinner/loading-spinner.component';
import { InputComponent } from '../input/input.component';
import { ReportsMainTableComponent } from '../reports-main-table/reports-main-table.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { genderValues } from '../../main/types.module';
import ReportsService, { StudentModel } from '../reports.service';
import { SelectInputComponent } from '../../main/select-input/select-input.component';
import { CountriesService } from '../../core/services/coutries.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main-search',
  imports: [
    LoadingSpinnerComponent,
    SelectInputComponent,
    InputComponent,
    ReportsMainTableComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './main-search.component.html',
  styleUrl: './main-search.component.css',
})
export class MainSearchComponent {
  genderValues: string[] = genderValues;

  countriesService = inject(CountriesService);

  countries = this.countriesService.countries;

  report: StudentModel = {};

  isLoadingReport = signal(false);
  isLoading: Signal<boolean> = signal(false);

  reportsResult: Signal<StudentModel[]> = signal([]);

  // Pagination state
  currentPage = signal(1);
  limit = signal(50);
  limitOptions = [10, 20, 50, 100];
  totalItems = computed(() => this.reportsService.reportResult().totalItems);
  totalPages = computed(() => this.reportsService.reportResult().totalPages);

  constructor(
    private reportsService: ReportsService,
    private toastr: ToastrService
  ) {
    this.reportsResult = computed(() => reportsService.reportResult().items);
    this.isLoading = computed(() => reportsService.isSearching());
  }

  form = new FormGroup({
    nationality: new FormControl('', []),
    gender: new FormControl('', []),
    name: new FormControl('', []),
    code: new FormControl('', []),
  });

  onInputChange(value: string, field: string) {
    (this.report as any)[field] = value.trim();
  }

  getControl(
    controlName: keyof typeof this.form.controls
  ): FormControl<string | null> {
    return this.form.get(controlName) as FormControl<string | null>;
  }

  sendRequest(page: number = 1) {
    this.currentPage.set(page);
    this.reportsService.getStudents(
      this.report,
      this.currentPage(),
      this.limit()
    );
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.sendRequest(newPage);
    }
  }

  changeLimit(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.limit.set(Number(target.value));
    this.sendRequest(1);
  }

  downloadReport() {
    this.isLoadingReport.set(true);
    try {
      this.reportsService.downloadReport(this.report).subscribe({
        next: (response) => {
          let fileName = 'report.xlsx';
          let blob = response.body as Blob;
          let a = document.createElement('a');
          a.download = fileName;
          a.href = window.URL.createObjectURL(blob);
          a.click();
        },
        error: (error) => {
          let errorMessage =
            error.status < 500 ? error.error.message : 'حدث خطأ غير متوقع';

          this.toastr.error(errorMessage, '', {
            positionClass: 'toast-bottom-right',
          });
        },
      });
    } catch (error) {
      console.log((error as Error).message);
    }
    this.isLoadingReport.set(false);
  }
}
