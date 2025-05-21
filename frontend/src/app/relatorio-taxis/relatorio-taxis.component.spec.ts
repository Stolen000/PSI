import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioTaxisComponent } from './relatorio-taxis.component';

describe('RelatorioTaxisComponent', () => {
  let component: RelatorioTaxisComponent;
  let fixture: ComponentFixture<RelatorioTaxisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RelatorioTaxisComponent]
    });
    fixture = TestBed.createComponent(RelatorioTaxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
