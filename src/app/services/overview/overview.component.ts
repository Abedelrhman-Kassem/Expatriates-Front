import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinnerComponent } from '../../core/components/loading-spinner/loading-spinner.component';
import { ServicesService, ServiceModel } from '../services.service';
import { StudentServicesService } from '../student-services.service';
import { AuthService } from '../../login/auth-service.service';

import { PublicService } from '../../core/services/public.service';

@Component({
  selector: 'app-services-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class ServicesOverviewComponent implements OnInit {
  services = signal<ServiceModel[]>([]);
  isLoading = signal<boolean>(false);
  
  studentMode = false;
  isPublic = false;
  studentId: number | null = null;

  private servicesService = inject(ServicesService);
  private studentServicesService = inject(StudentServicesService);
  private publicService = inject(PublicService);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public authService = inject(AuthService);

  // Delete dialog state
  showDeleteConfirm = false;
  deleteId: number | null = null;

  ngOnInit(): void {
    // Check route params to determine mode
    this.route.params.subscribe(params => {
      if (params['studentMode'] && params['studentId']) {
        // If studentMode is 'false', it implies public access for student (as per requirement)
        // We set studentMode = true for UI to show 'Pay' buttons, but set isPublic = true for API calls
        if (params['studentMode'] === 'false') {
          this.studentMode = false;
          this.isPublic = true;
        } else {
          this.studentMode = true;
          this.isPublic = false;
        }
        this.studentId = +params['studentId'];
      }
    });
    
    this.loadServices();
  }

  loadServices() {
    this.isLoading.set(true);
    
    const request = this.isPublic 
      ? this.publicService.getServices()
      : this.servicesService.getServices();

    request.subscribe({
      next: (data: ServiceModel[]) => {
        this.services.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.toastr.error('فشل تحميل الخدمات');
        this.isLoading.set(false);
      },
    });
  }

  // Open custom confirmation dialog
  openDeleteConfirm(id: number) {
    this.deleteId = id;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (this.deleteId !== null) {
      this.servicesService.deleteService(this.deleteId).subscribe({
        next: () => {
          this.toastr.success('تم حذف الخدمة بنجاح');
          this.loadServices();
        },
        error: () => {
          this.toastr.error('فشل حذف الخدمة');
        },
      });
    }
    this.showDeleteConfirm = false;
    this.deleteId = null;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.deleteId = null;
  }

  // Called from template when delete icon is clicked
  deleteService(id: number) {
    this.openDeleteConfirm(id);
  }

  // New method for student service selection
  PayService(serviceId: number) {
    if (this.studentId) {
      this.studentServicesService.createStudentService({
        studentId: this.studentId,
        serviceId: serviceId
      }).subscribe({
        next: () => {
          this.toastr.success('تم إضافة الخدمة بنجاح');
          // this.router.navigate(['/expenses']);
        },
        error: () => {
          this.toastr.error('فشل إضافة الخدمة');
        },
      });
    }
  }
}
