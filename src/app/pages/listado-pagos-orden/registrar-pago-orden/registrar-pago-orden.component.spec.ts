import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPagoOrdenComponent } from './registrar-pago-orden.component';

describe('RegistrarPagoOrdenComponent', () => {
  let component: RegistrarPagoOrdenComponent;
  let fixture: ComponentFixture<RegistrarPagoOrdenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrarPagoOrdenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarPagoOrdenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
