import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertParentComponent } from './alert-parent.component';

describe('AlertParentComponent', () => {
  let component: AlertParentComponent;
  let fixture: ComponentFixture<AlertParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertParentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
