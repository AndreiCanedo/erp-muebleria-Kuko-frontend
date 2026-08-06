import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioEditarPagoComponent } from './formulario-editar-pago.component';

describe('FormularioEditarPagoComponent', () => {
  let component: FormularioEditarPagoComponent;
  let fixture: ComponentFixture<FormularioEditarPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormularioEditarPagoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioEditarPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
