import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class InputComponent implements OnInit {
  placeholder = input.required<string>();
  id = input.required<string>();
  label = input.required<string>();
  type = input<string>('text');
  initialValue = input<string>('');

  @Output() valueChange = new EventEmitter<string>();
  value: string = '';

  ngOnInit() {
    const initial = this.initialValue();
    if (initial) {
      this.value = initial;
      this.valueChange.emit(initial);
    }
  }

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.valueChange.emit(value);
  }
}
