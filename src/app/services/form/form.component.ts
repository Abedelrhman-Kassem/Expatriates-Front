import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ServicesService } from '../services.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinnerComponent } from '../../core/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class ServiceFormComponent implements OnInit {
  form: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
  });

  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  serviceId: number | null = null;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private servicesService = inject(ServicesService);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode.set(true);
        this.serviceId = +params['id'];
        this.loadService(this.serviceId);
      }
    });
  }

  loadService(id: number) {
    this.isLoading.set(true);
    this.servicesService.getServices().subscribe({
      next: (services) => {
        const service = services.find((s) => s.id === id);
        if (service) {
          this.form.patchValue({
            name: service.name,
            price: service.price,
          });
        } else {
          this.toastr.error('الخدمة غير موجودة');
          this.router.navigate(['/services']);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.toastr.error('فشل تحميل الخدمة');
        this.router.navigate(['/services']);
        this.isLoading.set(false);
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const serviceData = this.form.value;

    if (this.isEditMode() && this.serviceId) {
      this.servicesService.updateService(this.serviceId, serviceData).subscribe({
        next: () => {
          this.toastr.success('تم تعديل الخدمة بنجاح');
          this.router.navigate(['/services']);
        },
        error: (error) => {
          this.toastr.error(error.error.message || 'فشل تعديل الخدمة');
          this.isLoading.set(false);
        },
      });
    } else {
      this.servicesService.createService(serviceData).subscribe({
        next: () => {
          this.toastr.success('تم إضافة الخدمة بنجاح');
          this.router.navigate(['/services']);
        },
        error: (error) => {
          this.toastr.error(error.error.message || 'فشل إضافة الخدمة');
          this.isLoading.set(false);
        },
      });
    }
  }
}
