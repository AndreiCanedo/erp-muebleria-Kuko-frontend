import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePagoOrdenComponent } from './detalle-pago-orden.component';

describe('DetallePagoOrdenComponent', () => {
  let component: DetallePagoOrdenComponent;
  let fixture: ComponentFixture<DetallePagoOrdenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetallePagoOrdenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallePagoOrdenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
