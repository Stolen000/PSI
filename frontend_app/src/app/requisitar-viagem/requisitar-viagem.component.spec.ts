import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitarViagemComponent } from './requisitar-viagem.component';

describe('RequisitarViagemComponent', () => {
  let component: RequisitarViagemComponent;
  let fixture: ComponentFixture<RequisitarViagemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequisitarViagemComponent]
    });
    fixture = TestBed.createComponent(RequisitarViagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
