import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { ReportsComponent } from './reports/reports.component';
import { EmailsComponent } from './emails/emails.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { StudentInfoComponent } from './reports/reports-main-table/student-info/student-info.component';
import { MainSearchComponent } from './reports/main-search/main-search.component';
import { EnrollmentsComponent } from './enrollments/enrollments.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { SetRequirementsComponent } from './expenses/set-requirements/set-requirements.component';
import { PayInstallmentsComponent } from './expenses/pay-installments/pay-installments.component';
import { OverviewComponent } from './expenses/overview/overview.component';
import { authGuard, superAdminGuard } from './login/auth.guard';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { UserOverviewComponent } from './users/user-overview/user-overview.component';
import { UserComponent } from './users/user/user.component';
import { ServicesOverviewComponent } from './services/overview/overview.component';
import { ServiceFormComponent } from './services/form/form.component';
import { StudentSearchComponent } from './student-search/student-search.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'createStudent',
  },
  {
    path: 'student-search',
    component: StudentSearchComponent,
    title: 'البحث عن طالب',
  },
  {
    path: 'login',
    title: 'تسجيل الدخول',
    component: LoginComponent,
  },
  {
    path: 'createStudent',
    title: 'الرئيسية',
    component: MainComponent,
    canActivate: [authGuard],
  },
  {
    path: 'reports',
    component: ReportsComponent,
    title: 'التقارير',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: MainSearchComponent,
      },
      {
        path: 'studentInfo/:id',
        component: StudentInfoComponent,
      },
    ],
  },
  {
    path: 'emails',
    component: EmailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'enrollments',
    component: EnrollmentsComponent,
    title: 'الاشتراكات',
    canActivate: [authGuard],
  },
  {
    path: 'expenses',
    component: ExpensesComponent,
    title: 'المدفوعات',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: OverviewComponent,
      },
      {
        path: 'set-expenses/:id',
        component: SetRequirementsComponent,
      },
      {
        path: 'pay-installments/:id',
        component: PayInstallmentsComponent,
      },
    ],
  },
  {
    path: 'services/add',
    component: ServiceFormComponent,
    title: 'إضافة خدمة',
    canActivate: [authGuard],
  },
  {
    path: 'services/edit/:id',
    component: ServiceFormComponent,
    title: 'تعديل خدمة',
    canActivate: [authGuard],
  },
  {
    path: 'studentServices/:studentMode/:studentId',
    component: ServicesOverviewComponent,
    title: 'الخدمات',
  },
  {
    path: 'services',
    component: ServicesOverviewComponent,
    title: 'الخدمات',
    canActivate: [authGuard],
  },
  {
    path: 'users',
    component: UsersComponent,
    title: 'المستخدمين',
    canActivate: [authGuard, superAdminGuard],
    children: [
      {
        path: '',
        component: UserOverviewComponent,
      },
      {
        path: 'user/:id',
        component: UserComponent,
      },
      {
        path: 'create-admin',
        component: UserComponent,
      },
    ],
  },

  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
