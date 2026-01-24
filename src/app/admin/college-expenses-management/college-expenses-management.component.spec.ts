import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeExpensesManagementComponent } from './college-expenses-management.component';

describe('CollegeExpensesManagementComponent', () => {
  let component: CollegeExpensesManagementComponent;
  let fixture: ComponentFixture<CollegeExpensesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollegeExpensesManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollegeExpensesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
