import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisicaoTaxiComponent } from './requisicao-taxi.component';

describe('RequisicaoTaxiComponent', () => {
  let component: RequisicaoTaxiComponent;
  let fixture: ComponentFixture<RequisicaoTaxiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequisicaoTaxiComponent]
    });
    fixture = TestBed.createComponent(RequisicaoTaxiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
