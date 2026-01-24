import { Component, computed, inject, Signal, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from './input/input.component';
import { SelectInputComponent } from './select-input/select-input.component';
import CreateStudentService from './main.service';
import {
  admissionYearValues,
  requestTypeValues,
  collegeValues,
  educationTypeValues,
  educationStageValues,
  entryTypeValues,
  exemptionStatusValues,
  formatTypeValues,
  genderValues,
  studentStatusValues,
  applicationTypeValues,
} from './types.module';
import { LoadingSpinnerComponent } from '../core/components/loading-spinner/loading-spinner.component';
import { HttpClient } from '@angular/common/http';
import { valueInArrayValidator } from '../core/helpers/helper';
import { CountriesService } from '../core/services/coutries.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    InputComponent,
    FormsModule,
    SelectInputComponent,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  genderValues: string[] = genderValues;
  admissionYearValues: string[] = admissionYearValues;
  exemptionStatusValues: string[] = exemptionStatusValues;
  studentStatusValues: string[] = studentStatusValues;
  entryTypeValues: string[] = entryTypeValues;
  collegeValues: string[] = collegeValues;
  requestTypeValues: string[] = requestTypeValues;
  educationStageValues: string[] = educationStageValues;
  educationTypeValues: string[] = educationTypeValues;
  formatTypeValues: string[] = formatTypeValues;
  applicationTypeValues: string[] = applicationTypeValues;

  isLoading: Signal<boolean> = signal(false);
  constructor(
    public createStudentService: CreateStudentService,
    private http: HttpClient,
  ) {
    this.isLoading = computed(() => this.createStudentService.isLoading());
  }

  countriesService = inject(CountriesService);

  countries = this.countriesService.countries;

  onInputChange(value: string, field: string) {
    (this.createStudentService.student as any)[field] = value;
  }

  async sendRequest() {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;
    try {
      await this.createStudentService.postStudent();
    } catch (error) {
      console.log((error as Error).message);
    }
  }

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    submissionNumber: new FormControl('', [Validators.required]),
    passportNumber: new FormControl('', [Validators.required]),
    idNumber: new FormControl('', [Validators.required]),
    birthDate: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    educationStage: new FormControl('', [Validators.required]),
    percentage: new FormControl('', [Validators.required]),

    nationality: new FormControl('', [
      Validators.required,
      valueInArrayValidator(undefined, this.countries),
    ]),
    college: new FormControl('', [
      Validators.required,
      valueInArrayValidator(this.collegeValues),
    ]),
    gender: new FormControl('', [
      Validators.required,
      valueInArrayValidator(this.genderValues),
    ]),
    certificateCountry: new FormControl('', [
      Validators.required,
      valueInArrayValidator(undefined, this.countries),
    ]),
    admissionYear: new FormControl('', [
      Validators.required,
      valueInArrayValidator(this.admissionYearValues),
    ]),
    exemptionStatus: new FormControl('', [
      Validators.required,
      valueInArrayValidator(this.exemptionStatusValues),
    ]),
    requestType: new FormControl('', [
      Validators.required,
      valueInArrayValidator(this.requestTypeValues),
    ]),
    applicationType: new FormControl('', [
      Validators.required,
      valueInArrayValidator(this.applicationTypeValues),
    ]),
    educationType: new FormControl('', [
      Validators.required,
      valueInArrayValidator(this.educationTypeValues),
    ]),
    formatType: new FormControl('', [
      Validators.required,
      valueInArrayValidator(this.formatTypeValues),
    ]),
  });

  getControl(
    controlName: keyof typeof this.form.controls,
  ): FormControl<string | null> {
    return this.form.get(controlName) as FormControl<string | null>;
  }
}
