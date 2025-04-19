import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoristaComponent } from './motorista.component';

describe('MotoristaComponent', () => {
  let component: MotoristaComponent;
  let fixture: ComponentFixture<MotoristaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MotoristaComponent]
    });
    fixture = TestBed.createComponent(MotoristaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
