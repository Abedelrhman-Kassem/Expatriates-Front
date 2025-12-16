import { Component, effect, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-input-without-control',
  imports: [FormsModule],
  templateUrl: './select-input-without-control.component.html',
  styleUrl: './select-input-without-control.component.css',
})
export class SelectInputWithoutControlComponent {
  id = input.required<string>();
  label = input.required<string>();
  options = input.required<string[]>();
  valueChange = output<string>();

  inputValue = '';
  filteredOptions: string[] = [];
  showDropdown = false;

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
      this.normalizeArabic(opt).includes(val)
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
