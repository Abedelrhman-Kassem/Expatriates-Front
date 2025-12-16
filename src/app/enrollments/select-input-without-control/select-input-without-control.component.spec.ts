import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectInputWithoutControlComponent } from './select-input-without-control.component';

describe('SelectInputWithoutControlComponent', () => {
  let component: SelectInputWithoutControlComponent;
  let fixture: ComponentFixture<SelectInputWithoutControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectInputWithoutControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectInputWithoutControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
