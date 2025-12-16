import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridDisabledInputsComponent } from './grid-disabled-inputs.component';

describe('GridDisabledInputsComponent', () => {
  let component: GridDisabledInputsComponent;
  let fixture: ComponentFixture<GridDisabledInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridDisabledInputsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridDisabledInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
