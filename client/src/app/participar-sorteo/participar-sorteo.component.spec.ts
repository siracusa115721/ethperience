import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticiparSorteoComponent } from './participar-sorteo.component';

describe('ParticiparSorteoComponent', () => {
  let component: ParticiparSorteoComponent;
  let fixture: ComponentFixture<ParticiparSorteoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticiparSorteoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticiparSorteoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
