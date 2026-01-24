import { Component, inject } from '@angular/core';
import { InputComponent } from '../reports/input/input.component';
import { SelectInputComponent } from '../main/select-input/select-input.component';
import { StudentModel } from '../reports/reports.service';
import { CountriesService } from '../core/services/coutries.service';
import { collegeValues } from '../main/types.module';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { baseUrl } from '../core/constants/constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-emails',
  imports: [InputComponent, SelectInputComponent, ReactiveFormsModule],
  templateUrl: './emails.component.html',
  styleUrl: './emails.component.css',
})
export class EmailsComponent {
  emailModel: StudentModel = {};
  countriesService = inject(CountriesService);
  countries = this.countriesService.countries;
  collegeValues: string[] = collegeValues;
  toastr: ToastrService = inject(ToastrService);

  http = inject(HttpClient);

  onInputChange(value: string, field: string) {
    (this.emailModel as any)[field] = value;
  }

  sendRequest() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    let params = new HttpParams();
    Object.entries(this.emailModel).forEach(([key, value]) => {
      if (value) {
        params = params.set(key, value);
      }
    });

    this.http
      .post(
        baseUrl + 'sendEmail',
        {
          subject: this.form.get('subject')?.value,
          info: this.form.get('info')?.value,
        },
        { params }
      )
      .subscribe({
        next: (response) => {
          this.toastr.success('تم ارسال البريد بنجاح');
        },
        error: (error) => {
          this.toastr.error(
            error.error.message || 'حدث خطأ أثناء ارسال البريد'
          );
        },
      });
  }

  form: FormGroup = new FormGroup({
    subject: new FormControl('', Validators.required),
    info: new FormControl('', Validators.required),
  });
}
