import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioEditarOrdenComponent } from './formulario-editar-orden.component';

describe('FormularioEditarOrdenComponent', () => {
  let component: FormularioEditarOrdenComponent;
  let fixture: ComponentFixture<FormularioEditarOrdenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormularioEditarOrdenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioEditarOrdenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
