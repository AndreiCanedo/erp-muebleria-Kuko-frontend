import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioEgresoComponent } from './formulario-egreso.component';

describe('FormularioEgresoComponent', () => {
  let component: FormularioEgresoComponent;
  let fixture: ComponentFixture<FormularioEgresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormularioEgresoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioEgresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
