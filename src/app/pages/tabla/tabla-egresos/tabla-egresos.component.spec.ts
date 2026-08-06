import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaEgresosComponent } from './tabla-egresos.component';

describe('TablaEgresosComponent', () => {
  let component: TablaEgresosComponent;
  let fixture: ComponentFixture<TablaEgresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TablaEgresosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
