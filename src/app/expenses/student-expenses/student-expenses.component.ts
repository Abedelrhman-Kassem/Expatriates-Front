import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinnerComponent } from '../../core/components/loading-spinner/loading-spinner.component';
import { ConfirmModalComponent } from '../../core/components/confirm-modal/confirm-modal.component';
import {
  StudentExpensesService,
  StudentExpensesResponse,
  YearSection,
  Installment,
} from '../../core/services/student-expenses.service';
import { studentStatusValues } from '../../main/types.module';

@Component({
  selector: 'app-student-expenses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './student-expenses.component.html',
  styleUrl: './student-expenses.component.css',
})
export class StudentExpensesComponent implements OnInit {
  id = input.required<string>();

  private expensesService = inject(StudentExpensesService);
  private toastr = inject(ToastrService);

  studentStatusValues = studentStatusValues;
  receiptTypeValues = ['فردى', 'مجمع'];

  isLoading = signal(false);
  expensesData = signal<StudentExpensesResponse | null>(null);

  // For add installment modal
  showAddInstallmentModal = signal(false);
  addInstallmentYear = signal('');
  addInstallmentAmount = signal<number>(0);
  addInstallmentReceiptType = signal<string>('فردى');
  addInstallmentSubmitting = signal(false);

  // For delete confirmation modal
  showDeleteModal = signal(false);
  installmentToDelete = signal<number | null>(null);
  deleteModalSubmitting = signal(false);

  // For year editing - track which year is being edited
  editingYearData: {
    year: string;
    customAmount: number | null;
    studentStatus: string;
  } | null = null;

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.isLoading.set(true);
    const studentId = parseInt(this.id(), 10);

    this.expensesService.getStudentExpenses(studentId).subscribe({
      next: (data) => {
        this.expensesData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'فشل تحميل بيانات المصروفات');
        this.isLoading.set(false);
      },
    });
  }

  // =================== YEAR SECTION ACTIONS ===================

  startEditYear(yearSection: YearSection): void {
    this.editingYearData = {
      year: yearSection.year,
      customAmount: yearSection.isCustomAmount ? yearSection.requiredAmount : null,
      studentStatus: yearSection.studentStatus,
    };
  }

  cancelEditYear(): void {
    this.editingYearData = null;
  }

  onYearAmountChange(value: string): void {
    if (this.editingYearData) {
      const parsed = parseFloat(value);
      this.editingYearData.customAmount = isNaN(parsed) ? null : parsed;
    }
  }

  onYearStatusChange(value: string): void {
    if (this.editingYearData) {
      this.editingYearData.studentStatus = value;
    }
  }

  resetToDefault(): void {
    if (this.editingYearData) {
      this.editingYearData.customAmount = null;
    }
  }

  saveYearChanges(): void {
    if (!this.editingYearData) return;

    const studentId = parseInt(this.id(), 10);
    const { year, customAmount, studentStatus } = this.editingYearData;

    this.expensesService
      .updateYearData(studentId, year, { customAmount, studentStatus })
      .subscribe({
        next: () => {
          this.toastr.success('تم حفظ التغييرات');
          this.editingYearData = null;
          this.loadExpenses();
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'فشل الحفظ');
        },
      });
  }

  // =================== INSTALLMENT ACTIONS ===================

  openAddInstallmentModal(yearSection: YearSection): void {
    this.addInstallmentYear.set(yearSection.year);
    // Default amount is remaining for this year
    this.addInstallmentAmount.set(yearSection.remainingAmount > 0 ? yearSection.remainingAmount : 0);
    this.addInstallmentReceiptType.set('فردى');
    this.showAddInstallmentModal.set(true);
  }

  closeAddInstallmentModal(): void {
    this.showAddInstallmentModal.set(false);
    this.addInstallmentYear.set('');
    this.addInstallmentAmount.set(0);
    this.addInstallmentReceiptType.set('فردى');
  }

  onAddInstallmentAmountChange(value: string): void {
    const parsed = parseFloat(value);
    this.addInstallmentAmount.set(isNaN(parsed) ? 0 : parsed);
  }

  onAddInstallmentReceiptTypeChange(value: string): void {
    this.addInstallmentReceiptType.set(value);
  }

  submitAddInstallment(): void {
    const studentId = parseInt(this.id(), 10);
    const year = this.addInstallmentYear();
    const amount = this.addInstallmentAmount();
    const receiptType = this.addInstallmentReceiptType();

    if (amount <= 0) {
      this.toastr.error('المبلغ يجب أن يكون أكبر من صفر');
      return;
    }

    // Check if adding this installment would exceed the required amount
    const yearSection = this.expensesData()?.yearSections.find(s => s.year === year);
    if (yearSection) {
      const currentInstallmentsTotal = yearSection.installments.reduce((sum, i) => sum + i.amount, 0);
      if (currentInstallmentsTotal + amount > yearSection.requiredAmount) {
        this.toastr.error('إجمالي أذونات الدفع لا يمكن أن يتجاوز المبلغ المستحق لهذا العام');
        return;
      }
    }

    this.addInstallmentSubmitting.set(true);

    this.expensesService.createInstallment(studentId, year, amount, receiptType).subscribe({
      next: () => {
        this.toastr.success('تم إضافة إذن الدفع');
        this.closeAddInstallmentModal();
        this.addInstallmentSubmitting.set(false);
        this.loadExpenses();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'فشل إضافة إذن الدفع');
        this.addInstallmentSubmitting.set(false);
      },
    });
  }

  // Update installment (receipt number, type, isPaid)
  updateInstallment(
    installment: Installment,
    field: 'receiptNumber' | 'receiptType' | 'isPaid',
    value: string | boolean
  ): void {
    if (!installment.id) return;

    // If already paid, prevent any updates
    if (installment.isPaid) {
      this.toastr.error('لا يمكن تعديل إذن دفع تم سداده');
      return;
    }

    // Validate before marking as paid
    if (field === 'isPaid' && value === true) {
      if (!installment.receiptNumber || installment.receiptNumber.trim() === '') {
        this.toastr.error('يجب إدخال رقم الإيصال قبل تأكيد السداد');
        return;
      }
      if (!installment.receiptType) {
        this.toastr.error('يجب اختيار نوع الإيصال قبل تأكيد السداد');
        return;
      }
      if (!installment.amount || installment.amount <= 0) {
        this.toastr.error('المبلغ غير صالح');
        return;
      }
    }

    const updateData: any = {};
    updateData[field] = value;

    this.expensesService.updateInstallment(installment.id, updateData).subscribe({
      next: (res) => {
        this.toastr.success('تم التحديث');
        // Update local data
        Object.assign(installment, res.installment);
        // Reload to get updated summary
        this.loadExpenses();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'فشل التحديث');
      },
    });
  }

  // Delete installment
  confirmDeleteInstallment(installmentId: number): void {
    this.installmentToDelete.set(installmentId);
    this.showDeleteModal.set(true);
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.installmentToDelete.set(null);
  }

  executeDelete(): void {
    const installmentId = this.installmentToDelete();
    if (!installmentId) return;

    this.deleteModalSubmitting.set(true);

    this.expensesService.deleteInstallment(installmentId).subscribe({
      next: () => {
        this.toastr.success('تم حذف إذن الدفع');
        this.showDeleteModal.set(false);
        this.installmentToDelete.set(null);
        this.deleteModalSubmitting.set(false);
        this.loadExpenses();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'فشل الحذف');
        this.deleteModalSubmitting.set(false);
      },
    });
  }

  // =================== PRINTING ===================

  printInstallment(installment: Installment): void {
    // TODO: Implement print functionality
    this.toastr.info('سيتم تنفيذ طباعة إذن الدفع لاحقاً');
  }

  // =================== HELPERS ===================

  isYearEditing(year: string): boolean {
    return this.editingYearData?.year === year;
  }

  getEditingAmount(): number | null {
    return this.editingYearData?.customAmount ?? null;
  }

  getEditingStatus(): string {
    return this.editingYearData?.studentStatus ?? '';
  }

  formatCurrency(amount: number): string {
    return amount.toLocaleString('ar-EG') + ' جنيه';
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG');
  }
}
