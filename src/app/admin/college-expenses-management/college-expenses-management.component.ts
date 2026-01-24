import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CollegeService, College } from '../../core/services/college.service';
import {
  CollegeExpensesService,
  CollegeExpense,
} from '../../core/services/college-expenses.service';
import { AuthService } from '../../login/auth-service.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinnerComponent } from '../../core/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-college-expenses-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './college-expenses-management.component.html',
  styleUrl: './college-expenses-management.component.css',
})
export class CollegeExpensesManagementComponent implements OnInit {
  private collegeService = inject(CollegeService);
  private expensesService = inject(CollegeExpensesService);
  private toastr = inject(ToastrService);
  public authService = inject(AuthService); // Inject Auth Service

  colleges = signal<College[]>([]);
  expenses = signal<CollegeExpense[]>([]);
  selectedCollegeId = signal<number | null>(null);
  isLoading = signal<boolean>(false);

  // Permissions
  // Permissions
  // Use authService signals directly in template
  // isCollegeAdmin = this.authService.isCollegeAdmin;
  // isSystemAdmin = this.authService.isSystemAdmin;

  // Form
  newYear = '';
  newAmount: number | null = null;
  isSubmitting = false;

  ngOnInit(): void {
    this.checkPermissions();
    this.loadColleges();
  }

  checkPermissions() {
    // No local state to update, using signals directly
  }

  loadColleges() {
    this.isLoading.set(true);
    this.collegeService.getColleges().subscribe({
      next: (data) => {
        this.colleges.set(data);

        // Auto-select for college admin
        if (this.authService.isCollegeAdmin()) {
          const adminCollegeName = this.authService.adminCollege();
          console.log('Admin college from token:', adminCollegeName);
          console.log(
            'Available colleges:',
            data.map((c) => c.name),
          );

          if (adminCollegeName) {
            // Normalize strings for comparison (trim, lowercase, remove extra spaces)
            const normalizedAdminCollege = adminCollegeName
              .trim()
              .toLowerCase()
              .replace(/\s+/g, ' ');

            const myCollege = data.find(
              (c) =>
                c.name.trim().toLowerCase().replace(/\s+/g, ' ') ===
                normalizedAdminCollege,
            );

            if (myCollege) {
              this.selectedCollegeId.set(myCollege.id);
              this.loadExpenses(myCollege.id);
            } else {
              // Try partial match as fallback
              const partialMatch = data.find(
                (c) =>
                  c.name
                    .trim()
                    .toLowerCase()
                    .includes(normalizedAdminCollege) ||
                  normalizedAdminCollege.includes(c.name.trim().toLowerCase()),
              );

              if (partialMatch) {
                this.selectedCollegeId.set(partialMatch.id);
                this.loadExpenses(partialMatch.id);
                console.log(
                  'Used partial match for college:',
                  partialMatch.name,
                );
              } else {
                console.error(
                  'College not found. Admin college:',
                  adminCollegeName,
                  'Available:',
                  data.map((c) => c.name),
                );
                this.toastr.error(
                  'كليتك غير موجودة في النظام: ' + adminCollegeName,
                );
              }
            }
          }
        }

        this.isLoading.set(false);
      },
      error: () => {
        this.toastr.error('فشل تحميل الكليات');
        this.isLoading.set(false);
      },
    });
  }

  onCollegeSelect(event: Event) {
    // Prevent selection change if college admin
    if (this.authService.isCollegeAdmin()) return;

    const select = event.target as HTMLSelectElement;
    const id = parseInt(select.value);
    if (!isNaN(id)) {
      this.selectedCollegeId.set(id);
      this.loadExpenses(id);
    } else {
      this.selectedCollegeId.set(null);
      this.expenses.set([]);
    }
  }

  loadExpenses(collegeId: number) {
    this.isLoading.set(true);
    this.expensesService.getExpensesInCollege(collegeId).subscribe({
      next: (data) => {
        this.expenses.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.toastr.error('فشل تحميل المصروفات');
        this.isLoading.set(false);
      },
    });
  }

  addExpense() {
    // Permission Check
    if (this.authService.isSystemAdmin()) {
      this.toastr.warning('ليس لديك صلاحية التعديل');
      return;
    }

    const collegeId = this.selectedCollegeId();
    if (!collegeId) {
      this.toastr.warning('لم يتم اختيار الكلية');
      return;
    }
    if (!this.newYear || !this.newYear.trim()) {
      this.toastr.warning('يرجى إدخال السنة الدراسية');
      return;
    }
    if (this.newAmount === null || this.newAmount === undefined) {
      this.toastr.warning('يرجى إدخال المبلغ');
      return;
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const expense: CollegeExpense = {
      collegeId,
      year: this.newYear.trim(),
      amount: this.newAmount,
    };

    this.expensesService.createOrUpdateExpense(expense).subscribe({
      next: (saved) => {
        this.toastr.success('تم حفظ المصروفات');
        this.loadExpenses(collegeId);
        // this.newYear = ''; // Keep year for convenience? Or clear. User said "placeholder 2024/2025". Input usually clears.
        this.newAmount = null;
        this.isSubmitting = false;
      },
      error: () => {
        this.toastr.error('حدث خطأ أثناء الحفظ');
        this.isSubmitting = false;
      },
    });
  }

  deleteExpense(id: number) {
    if (this.authService.isSystemAdmin()) return;

    if (!confirm('هل أنت متأكد من الحذف؟')) return;

    this.expensesService.deleteExpense(id).subscribe({
      next: () => {
        this.toastr.success('تم الحذف بنجاح');
        if (this.selectedCollegeId()) {
          this.loadExpenses(this.selectedCollegeId()!);
        }
      },
      error: () => {
        this.toastr.error('فشل الحذف');
      },
    });
  }
}
