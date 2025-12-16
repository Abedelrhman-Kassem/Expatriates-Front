import { Component, input } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent {
  isShown;
  constructor() {
    this.isShown = true;
    setInterval(() => {
      this.isShown = false;
    }, 5000);
  }

  alertType = input.required<AlertType>();
  message = input.required<string>();

  closeAlert() {
    this.isShown = false;
  }
}

enum AlertType {
  Success = 'success',
  Danger = 'danger',
  Warning = 'warning',
  Info = 'info',
  Normal = 'normal',
}
