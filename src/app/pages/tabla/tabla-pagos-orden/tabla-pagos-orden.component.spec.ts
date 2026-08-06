import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaPagosOrdenComponent } from './tabla-pagos-orden.component';

describe('TablaPagosOrdenComponent', () => {
  let component: TablaPagosOrdenComponent;
  let fixture: ComponentFixture<TablaPagosOrdenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TablaPagosOrdenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaPagosOrdenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
