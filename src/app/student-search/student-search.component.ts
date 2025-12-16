import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PublicService } from '../core/services/public.service';

@Component({
  selector: 'app-student-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './student-search.component.html',
  styleUrl: './student-search.component.css',
})
export class StudentSearchComponent {
  submissionNumber = signal('');
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(private publicService: PublicService, private router: Router) {}

  searchStudent() {
    if (!this.submissionNumber()) {
      this.errorMessage.set('الرجاء إدخال رقم الطلب');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.publicService
      .getStudentBySubmissionNumber(this.submissionNumber())
      .subscribe({
        next: (student) => {
          this.isLoading.set(false);
          // Navigate to student services page with isPublic=false (as per request, though logically it might seem like true for public access, user asked for false in url)
          // User request: [routerLink]="['/studentServices/false/' + student().id]"
          // Wait, user said: "make sure that the boolean in the url is false"
          // Let's double check the route definition later. For now I will follow the instruction.
          this.router.navigate(['/studentServices', 'false', student.id]);
        },
        error: (err) => {
          this.isLoading.set(false);
          if (err.status === 404) {
            this.errorMessage.set('لم يتم العثور على طالب بهذا الرقم');
          } else {
            this.errorMessage.set('حدث خطأ أثناء البحث. الرجاء المحاولة مرة أخرى');
          }
          console.error('Search error:', err);
        },
      });
  }
}
