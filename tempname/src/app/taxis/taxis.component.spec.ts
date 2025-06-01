import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxisComponent } from './taxis.component';

describe('TaxisComponent', () => {
  let component: TaxisComponent;
  let fixture: ComponentFixture<TaxisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
