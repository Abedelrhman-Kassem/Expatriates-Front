import { Component, input, output } from '@angular/core';


@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css',
})
export class ConfirmModalComponent {
  isOpen = input<boolean>(false);
  title = input<string>('تأكيد');
  message = input<string>('هل أنت متأكد؟');
  confirmText = input<string>('تأكيد');
  cancelText = input<string>('إلغاء');
  isSubmitting = input<boolean>(false);
  confirmButtonClass = input<string>(
    'bg-red-600 hover:bg-red-700 focus:ring-red-300',
  );

  confirmed = output<void>();
  cancelled = output<void>();

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
