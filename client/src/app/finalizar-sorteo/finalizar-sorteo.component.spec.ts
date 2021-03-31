import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizarSorteoComponent } from './finalizar-sorteo.component';

describe('FinalizarSorteoComponent', () => {
  let component: FinalizarSorteoComponent;
  let fixture: ComponentFixture<FinalizarSorteoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalizarSorteoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalizarSorteoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
