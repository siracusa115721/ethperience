import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanjearExperienciaComponent } from './canjear-experiencia.component';

describe('CanjearExperienciaComponent', () => {
  let component: CanjearExperienciaComponent;
  let fixture: ComponentFixture<CanjearExperienciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanjearExperienciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanjearExperienciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
