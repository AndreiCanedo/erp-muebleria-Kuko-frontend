import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaOrdenesComponent } from './tabla-ordenes.component';

describe('TablaOrdenesComponent', () => {
  let component: TablaOrdenesComponent;
  let fixture: ComponentFixture<TablaOrdenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TablaOrdenesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaOrdenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
