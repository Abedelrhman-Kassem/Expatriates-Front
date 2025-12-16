import { Component, inject, input, OnInit } from '@angular/core';
import { InstallmentsModel, RequirementsModel } from '../../expenses.service';
import { SelectInputComponent } from '../../../main/select-input/select-input.component';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../../../core/constants/constants';
import { LoadingSpinnerComponent } from '../../../core/components/loading-spinner/loading-spinner.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../../main/input/input.component';

@Component({
  selector: 'app-installments-talbe',
  imports: [
    InputComponent,
    SelectInputComponent,
    LoadingSpinnerComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './installments-talbe.component.html',
  styleUrl: './installments-talbe.component.css',
})
export class InstallmentsTalbeComponent implements OnInit {
  requirement = input.required<RequirementsModel>();
  installments = input.required<InstallmentsModel[]>();
  installmentsArray: InstallmentsModel[] = [];

  http: HttpClient = inject(HttpClient);

  installmentTitles = ['القسط الأول', 'القسط الثاني'];

  inputValues: Record<string, string> = {};

  isLoading: boolean = false;

  ngOnInit(): void {
    this.inputValues['requirementId'] = this.requirement().id?.toString() || '';
    this.installmentsArray = this.installments();
  }

  onInputChange(value: string, field: string) {
    this.inputValues[field] = value;
  }

  sendRequest() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.http.post(baseUrl + 'installments', this.inputValues).subscribe({
      next: (response) => {
        this.installmentsArray.push(response);
        this.isLoading = false;
        this.form.reset();

        this.inputValues['requirementId'] =
          this.requirement().id?.toString() || '';
      },
      error: (error) => {
        console.error('Error:', error);
        this.isLoading = false;
      },
    });
  }

  form: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required]),
    operationNumber: new FormControl('', [Validators.required]),
  });

  getControl(controlName: string): FormControl<string | null> {
    return this.form.get(controlName) as FormControl<string | null>;
  }
}
