import { Component, input } from '@angular/core';

@Component({
  selector: 'app-disabled-input',
  imports: [],
  templateUrl: './disabled-input.component.html',
  styleUrl: './disabled-input.component.css',
})
export class DisabledInputComponent {
  label = input.required<string>();
  value = input.required<string>();
}
