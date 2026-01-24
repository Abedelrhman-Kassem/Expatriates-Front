import { Component, effect, input, output, OnInit } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.css',
})
export class SelectInputComponent implements OnInit {
  id = input.required<string>();
  label = input.required<string>();
  options = input.required<string[]>();
  control = input<FormControl<string | null>>();
  disabled = input<boolean>(false);
  initialValue = input<string>('');
  valueChange = output<string>();

  inputValue = '';
  filteredOptions: string[] = [];
  showDropdown = false;

  ngOnInit() {
    const initial = this.initialValue();
    if (initial) {
      this.inputValue = initial;
      this.valueChange.emit(initial);
    }
  }

  constructor() {
    effect(() => {
      this.filteredOptions = this.options();
    });
  }

  filterOptions() {
    if (!this.inputValue) {
      this.filteredOptions = this.options();
      this.valueChange.emit('');
      return;
    }

    this.valueChange.emit(this.inputValue);

    const val = this.inputValue.toLowerCase();
    this.filteredOptions = this.options().filter((opt) =>
      this.normalizeArabic(opt).includes(val),
    );
  }

  selectOption(option: string) {
    this.inputValue = option;
    this.valueChange.emit(option);
    this.showDropdown = false;
  }

  onBlur() {
    this.showDropdown = false;
  }

  normalizeArabic(text: string): string {
    return text
      .toLowerCase()
      .replace(/أ|إ|آ/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ۀ|ة/g, 'ه')
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي');
  }
}
