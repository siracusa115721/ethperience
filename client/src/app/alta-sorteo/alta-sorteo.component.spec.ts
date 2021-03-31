import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaSorteoComponent } from './alta-sorteo.component';

describe('AltaSorteoComponent', () => {
  let component: AltaSorteoComponent;
  let fixture: ComponentFixture<AltaSorteoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaSorteoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaSorteoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
