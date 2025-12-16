import { Component, inject, input, OnInit } from '@angular/core';
import { SelectInputComponent } from '../../main/select-input/select-input.component';
import { admissionYearValues, gradeValues } from '../../main/types.module';
import { InputComponent } from '../../main/input/input.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { valueInArrayValidator } from '../../core/helpers/helper';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../../core/constants/constants';
import { LoadingSpinnerComponent } from '../../core/components/loading-spinner/loading-spinner.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-set-requirements',
  imports: [
    InputComponent,
    SelectInputComponent,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './set-requirements.component.html',
  styleUrl: './set-requirements.component.css',
})
export class SetRequirementsComponent implements OnInit {
  id = input.required<string>();
  inputValues: Record<string, string> = {};

  gradeValues: string[] = gradeValues;
  admissionYearValues: string[] = admissionYearValues;

  http: HttpClient = inject(HttpClient);
  toastr: ToastrService = inject(ToastrService);

  isLoading: boolean = false;

  sendRequest() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    this.http.post(baseUrl + 'requirements', this.inputValues).subscribe({
      next: (response) => {
        this.toastr.success('تم وضع المتطلبات بنجاح');
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('حدث خطأ ');
        this.isLoading = false;
      },
    });
  }

  onInputChange(value: string, field: string) {
    this.inputValues[field] = value;
  }

  ngOnInit(): void {
    this.inputValues['id'] = this.id();
  }

  form: FormGroup = new FormGroup({
    admissionYear: new FormControl('', [
      Validators.required,
      valueInArrayValidator(this.admissionYearValues),
    ]),
    grade: new FormControl('', [
      Validators.required,
      valueInArrayValidator(this.gradeValues),
    ]),
    amount: new FormControl('', [Validators.required]),
  });

  getControl(controlName: string): FormControl<string | null> {
    return this.form.get(controlName) as FormControl<string | null>;
  }
}
