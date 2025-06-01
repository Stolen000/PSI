import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaGestorComponent } from './area-gestor.component';

describe('AreaGestorComponent', () => {
  let component: AreaGestorComponent;
  let fixture: ComponentFixture<AreaGestorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AreaGestorComponent]
    });
    fixture = TestBed.createComponent(AreaGestorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
