import { TestBed } from '@angular/core/testing';

import { TransportPricesService } from './transport-prices.service';

describe('TransportPricesService', () => {
  let service: TransportPricesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransportPricesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
