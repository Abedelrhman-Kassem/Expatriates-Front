import { Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class InputComponent {
  placeholder = input.required<string>();
  id = input.required<string>();
  label = input.required<string>();
  type = input<string>('text');

  @Output() valueChange = new EventEmitter<string>();
  value: string | undefined;

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.valueChange.emit(value);
  }
}
