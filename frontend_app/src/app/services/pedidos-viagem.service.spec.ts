import { TestBed } from '@angular/core/testing';

import { PedidosViagemService } from './pedidos-viagem.service';

describe('PedidosViagemService', () => {
  let service: PedidosViagemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidosViagemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
