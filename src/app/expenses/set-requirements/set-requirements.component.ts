import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectInputComponent } from '../../main/select-input/select-input.component';
import { admissionYearValues, gradeValues } from '../../main/types.module';
import { InputComponent } from '../../main/input/input.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { valueInArrayValidator } from '../../core/helpers/helper';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../../core/constants/constants';
import { LoadingSpinnerComponent } from '../../core/components/loading-spinner/loading-spinner.component';
import { ToastrService } from 'ngx-toastr';

interface Requirement {
  id: number | null;
  studentId: number;
  amount: number | null;
  grade: string | null;
  admissionYear: string;
  source: 'default' | 'default_realized' | 'custom' | 'none';
  isVirtual: boolean;
}

@Component({
  selector: 'app-set-requirements',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    SelectInputComponent,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './set-requirements.component.html',
  styleUrl: './set-requirements.component.css',
})
export class SetRequirementsComponent implements OnInit {
  id = input.required<string>();

  gradeValues: string[] = gradeValues;
  admissionYearValues: string[] = admissionYearValues;

  http: HttpClient = inject(HttpClient);
  toastr: ToastrService = inject(ToastrService);

  requirements = signal<Requirement[]>([]);
  isLoading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  editingReqId: number | null = null; // If set, we are updating

  form: FormGroup = new FormGroup({
    admissionYear: new FormControl('', [
      Validators.required,
      valueInArrayValidator(this.admissionYearValues),
    ]),
    grade: new FormControl('', [
      Validators.required,
      valueInArrayValidator(this.gradeValues),
    ]),
    amount: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.loadRequirements();
  }

  loadRequirements() {
    this.isLoading.set(true);
    this.http
      .get<Requirement[]>(baseUrl + `requirements?id=${this.id()}`)
      .subscribe({
        next: (data) => {
          this.requirements.set(data);
          this.isLoading.set(false);
        },
        error: () => {
          this.toastr.error('فشل تحميل المتطلبات');
          this.isLoading.set(false);
        },
      });
  }

  getControl(controlName: string): FormControl<string | null> {
    return this.form.get(controlName) as FormControl<string | null>;
  }

  onInputChange(value: string, field: string) {
    this.form.get(field)?.setValue(value);
  }

  // Pre-fill form for editing or customizing
  startEdit(req: Requirement) {
    this.editingReqId = req.id;
    this.form.patchValue({
      admissionYear: req.admissionYear,
      grade: req.grade || '',
      amount: req.amount,
    });

    // If it's a realized default or custom, we edit (PUT).
    // If virtual default, we create (POST).
    // If none, we create (POST).
    if (req.source === 'default' || req.source === 'none') {
      this.editingReqId = null; // Treat as new creation
    }
  }

  cancelEdit() {
    this.editingReqId = null;
    this.form.reset();
  }

  deleteRequirement(reqId: number) {
    if (
      !confirm('هل أنت متأكد من الحذف؟ (سيعود للمصروفات الافتراضية إذا وجدت)')
    )
      return;

    this.http.delete(baseUrl + `requirements/${reqId}`).subscribe({
      next: () => {
        this.toastr.success('تم الحذف');
        this.loadRequirements();
      },
      error: () => this.toastr.error('فشل الحذف'),
    });
  }

  sendRequest() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    const payload = {
      ...this.form.value,
      id: this.id(), // Student ID required for POST
    };

    if (this.editingReqId) {
      // UPDATE (PUT)
      this.http
        .put(baseUrl + `requirements/${this.editingReqId}`, this.form.value)
        .subscribe({
          next: () => {
            this.toastr.success('تم التحديث');
            this.finishSubmit();
          },
          error: () => {
            this.toastr.error('فشل التحديث');
            this.isSubmitting.set(false);
          },
        });
    } else {
      // CREATE (POST)
      this.http.post(baseUrl + 'requirements', payload).subscribe({
        next: () => {
          this.toastr.success('تم الإضافة');
          this.finishSubmit();
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'فشل الإضافة');
          this.isSubmitting.set(false);
        },
      });
    }
  }

  finishSubmit() {
    this.isSubmitting.set(false);
    this.form.reset();
    this.editingReqId = null;
    this.loadRequirements();
  }
}
