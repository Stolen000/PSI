import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportPricesComponent } from './transport-prices.component';

describe('TransportPricesComponent', () => {
  let component: TransportPricesComponent;
  let fixture: ComponentFixture<TransportPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportPricesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
