import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaMotoristaComponent } from './area-motorista.component';

describe('AreaMotoristaComponent', () => {
  let component: AreaMotoristaComponent;
  let fixture: ComponentFixture<AreaMotoristaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AreaMotoristaComponent]
    });
    fixture = TestBed.createComponent(AreaMotoristaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
