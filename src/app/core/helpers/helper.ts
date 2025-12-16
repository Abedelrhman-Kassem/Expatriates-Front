import { Signal } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function valueInArrayValidator(
  allowdValues?: string[],
  mySignal?: Signal<string[]>
) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (mySignal) {
      allowdValues = mySignal();
    }

    if (value && !allowdValues?.includes(value)) {
      return { invalidValue: true };
    }
    return null;
  };
}
