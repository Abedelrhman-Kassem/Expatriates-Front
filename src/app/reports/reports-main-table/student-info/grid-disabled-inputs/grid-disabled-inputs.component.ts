import { Component, input, OnInit } from '@angular/core';
import { DisabledInputComponent } from '../disabled-input/disabled-input.component';
import { StudentModel } from '../../../reports.service';
import { studentLabels } from '../../../../core/constants/constants';

@Component({
  selector: 'app-grid-disabled-inputs',
  imports: [DisabledInputComponent],
  templateUrl: './grid-disabled-inputs.component.html',
  styleUrl: './grid-disabled-inputs.component.css',
})
export class GridDisabledInputsComponent implements OnInit {
  studentModel = input.required<StudentModel>();
  labels: string[] = [];
  values: string[] = [];

  ngOnInit(): void {
    for (const [key, value] of Object.entries(this.studentModel())) {
      if (
        key === 'createdAt' ||
        key === 'updatedAt' ||
        key === 'id' ||
        key === 'requirements'
      ) {
        continue;
      }

      this.labels.push((studentLabels as any)[key] || key);
      this.values.push(value);
    }
  }
}
