import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleEgresoComponent } from './detalle-egreso.component';

describe('DetalleEgresoComponent', () => {
  let component: DetalleEgresoComponent;
  let fixture: ComponentFixture<DetalleEgresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleEgresoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleEgresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
