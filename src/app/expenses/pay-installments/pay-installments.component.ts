import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, input, OnInit } from '@angular/core';
import { baseUrl } from '../../core/constants/constants';
import { RequirementsModel } from '../expenses.service';
import { InstallmentsTalbeComponent } from './installments-talbe/installments-talbe.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pay-installments',
  imports: [InstallmentsTalbeComponent],
  templateUrl: './pay-installments.component.html',
  styleUrl: './pay-installments.component.css',
})
export class PayInstallmentsComponent implements OnInit {
  id = input.required<string>();
  http: HttpClient = inject(HttpClient);

  requirements: RequirementsModel[] = [];

  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {
    let params = new HttpParams();
    params = params.set('id', this.id());

    this.http.get(baseUrl + 'requirements', { params }).subscribe({
      next: (response) => {
        this.requirements = response as RequirementsModel[];

        // this.toastr.success('Requirements loaded successfully', 'Success', {
        //   positionClass: 'toast-bottom-right',
        // });
      },
      error: (error) => {
        this.toastr.error('حدث خطأ أثناء جلب المتطلبات الماليه');
      },
    });
  }
}
