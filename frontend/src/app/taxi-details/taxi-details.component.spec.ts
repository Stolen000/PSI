import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxiDetailsComponent } from './taxi-details.component';

describe('TaxiDetailsComponent', () => {
  let component: TaxiDetailsComponent;
  let fixture: ComponentFixture<TaxiDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxiDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxiDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
