import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroAnuncianteComponent } from './registro-anunciante.component';

describe('RegistroAnuncianteComponent', () => {
  let component: RegistroAnuncianteComponent;
  let fixture: ComponentFixture<RegistroAnuncianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroAnuncianteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroAnuncianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
