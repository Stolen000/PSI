import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoristaPerfilComponent } from './motorista-perfil.component';

describe('MotoristaPerfilComponent', () => {
  let component: MotoristaPerfilComponent;
  let fixture: ComponentFixture<MotoristaPerfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MotoristaPerfilComponent]
    });
    fixture = TestBed.createComponent(MotoristaPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
