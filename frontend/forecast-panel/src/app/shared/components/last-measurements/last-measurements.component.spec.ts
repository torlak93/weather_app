import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastMeasurementsComponent } from './last-measurements.component';

describe('LastMeasurementsComponent', () => {
  let component: LastMeasurementsComponent;
  let fixture: ComponentFixture<LastMeasurementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LastMeasurementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LastMeasurementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
