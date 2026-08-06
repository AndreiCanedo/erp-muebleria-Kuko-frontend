import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPagosOrdenComponent } from './listado-pagos-orden.component';

describe('ListadoPagosOrdenComponent', () => {
  let component: ListadoPagosOrdenComponent;
  let fixture: ComponentFixture<ListadoPagosOrdenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListadoPagosOrdenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoPagosOrdenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
