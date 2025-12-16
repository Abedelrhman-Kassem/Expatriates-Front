import { Component, input } from '@angular/core';
import { StudentModel } from '../reports.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reports-main-table',
  imports: [RouterLink],
  templateUrl: './reports-main-table.component.html',
  styleUrl: './reports-main-table.component.css',
})
export class ReportsMainTableComponent {
  reportsArray = input.required<StudentModel[]>();
}
