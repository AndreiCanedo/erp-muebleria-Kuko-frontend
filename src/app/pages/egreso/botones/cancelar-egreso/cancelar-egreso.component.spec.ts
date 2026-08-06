import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelarEgresoComponent } from './cancelar-egreso.component';

describe('CancelarEgresoComponent', () => {
  let component: CancelarEgresoComponent;
  let fixture: ComponentFixture<CancelarEgresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelarEgresoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelarEgresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
