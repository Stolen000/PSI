import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosMotoristaComponent } from './pedidos-motorista.component';

describe('PedidosMotoristaComponent', () => {
  let component: PedidosMotoristaComponent;
  let fixture: ComponentFixture<PedidosMotoristaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PedidosMotoristaComponent]
    });
    fixture = TestBed.createComponent(PedidosMotoristaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
