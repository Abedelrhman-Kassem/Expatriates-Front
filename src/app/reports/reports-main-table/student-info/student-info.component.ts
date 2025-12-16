import { Component, inject, input, OnInit } from '@angular/core';
import ReportsService, { StudentModel } from '../../reports.service';
import { studentLabels } from '../../../core/constants/constants';
import { Location } from '@angular/common';
import { GridDisabledInputsComponent } from './grid-disabled-inputs/grid-disabled-inputs.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrl: './student-info.component.css',
  imports: [GridDisabledInputsComponent],
})
export class StudentInfoComponent implements OnInit {
  id = input.required<string>();
  studentModel: StudentModel | undefined = undefined;
  reportsService: ReportsService = inject(ReportsService);

  report: StudentModel = {};

  location: Location = inject(Location);
  toastr: ToastrService = inject(ToastrService);

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.report.id = this.id();

    this.studentModel =
      this.reportsService
        .reportResult()
        .items.find((student) => student.id?.toString() === this.id()) || {};
  }

  async downloadReport() {
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
        this.toastr.error(error.error.message || 'حدث خطأ أثناء تحميل التقرير');
      },
      complete: () => {
        this.toastr.success('تم تحميل التقرير بنجاح');
      },
    });
  }
}
